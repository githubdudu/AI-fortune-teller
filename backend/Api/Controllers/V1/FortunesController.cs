using System;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Api.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [EnableRateLimiting("OpenAILimiter")]
    public class FortunesController : ControllerBase
    {
        private readonly IFortuneService _fortuneService;

        // UTF-8 without a byte-order mark — a BOM ahead of the first SSE event
        // makes the first line unparseable for stricter clients
        private static readonly Encoding SseEncoding = new UTF8Encoding(
            encoderShouldEmitUTF8Identifier: false
        );

        public FortunesController(IFortuneService fortuneService)
        {
            _fortuneService = fortuneService;
        }

        [HttpPost("ask")]
        [Authorize]
        public async Task<ActionResult<FortuneDto>> AskFortune(
            [FromBody] CreateFortuneRequest request
        )
        {
            try
            {
                if (request == null)
                    return BadRequest("Request cannot be null");

                if (!request.IsValid())
                    return BadRequest(
                        "Request must include either a question or theme ID, and 1-3 cards"
                    );

                var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(
                        new { message = "User must be logged in to get a fortune reading" }
                    );
                }
                else
                {
                    request.UserEmail = userEmail;
                }

                var fortune = await _fortuneService.GenerateFortuneAsync(request);
                return Ok(fortune);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("stream")]
        public async Task StreamFortuneAsync(
            [FromBody] CreateFortuneRequest request,
            CancellationToken cancellationToken
        )
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await Response.WriteAsync("Invalid request data", cancellationToken);
                return;
            }

            if (request == null)
            {
                await Response.WriteAsync("Request cannot be null", cancellationToken);

                return;
            }

            if (!request.IsValid())
            {
                await Response.WriteAsync(
                    "Request must include either a question or theme ID, and 1-3 cards",
                    cancellationToken
                );
                return;
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                await Response.WriteAsync(
                    "User must be logged in to get a fortune reading",
                    cancellationToken
                );
                return;
            }
            else
            {
                request.UserEmail = userEmail;
            }

            Response.ContentType = "text/event-stream";
            Response.Headers["Cache-Control"] = "no-cache";
            Response.Headers["Connection"] = "keep-alive";
            Response.Headers["X-Accel-Buffering"] = "no"; // Disable buffering for Nginx

            try
            {
                // Create a StreamWriter that doesn't close the underlying stream when disposed.
                // Encoding.UTF8 would emit a BOM ahead of the first event, so use a
                // BOM-less UTF-8 encoder instead.
                using var writer = new StreamWriter(Response.Body, SseEncoding, leaveOpen: true)
                {
                    AutoFlush = true,
                };

                await foreach (
                    var chunk in _fortuneService
                        .GenerateFortuneStreamAsync(request, cancellationToken)
                        .WithCancellation(cancellationToken)
                )
                {
                    if (cancellationToken.IsCancellationRequested)
                    {
                        break;
                    }

                    // The provider reports which model actually served the request —
                    // send it as its own JSON event so the client can display it
                    if (!string.IsNullOrEmpty(chunk.Model))
                    {
                        var modelEvent = JsonSerializer.Serialize(
                            new { type = "model", model = chunk.Model }
                        );
                        await writer.WriteAsync($"data: {modelEvent}\n\n");
                        await writer.FlushAsync();
                    }

                    if (chunk.Text.Length == 0)
                    {
                        continue;
                    }

                    // The model's text routinely contains newlines (markdown headings,
                    // dividers, blank lines). Writing it raw would break SSE framing —
                    // a bare "\n\n" inside a chunk reads as an event boundary and every
                    // following line as a malformed event. JSON-encoding escapes those
                    // newlines so each event stays exactly one line.
                    var textEvent = JsonSerializer.Serialize(new { content = chunk.Text });
                    await writer.WriteAsync($"data: {textEvent}\n\n");
                    await writer.FlushAsync();
                }
            }
            catch (OperationCanceledException)
            {
                // Just exit when canceled
                return;
            }
            catch (Exception ex)
            {
                // Handle error asynchronously
                // Create a new writer for error handling to avoid "Cannot write to a closed TextWriter"
                using var errorWriter = new StreamWriter(Response.Body, SseEncoding, leaveOpen: true)
                {
                    AutoFlush = true,
                };
                // JSON-encoded for the same reason as the text events: an exception
                // message with a newline in it would otherwise break the framing
                var errorEvent = JsonSerializer.Serialize(
                    new { type = "error", message = $"Error: {ex.Message}" }
                );
                await errorWriter.WriteAsync($"data: {errorEvent}\n\n");
                await errorWriter.FlushAsync();
            }
        }
    }
}
