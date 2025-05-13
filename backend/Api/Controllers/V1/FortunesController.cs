using System;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class FortunesController : ControllerBase
    {
        private readonly IFortuneService _fortuneService;

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

                var userEmail = User.FindFirstValue(ClaimTypes.Email);

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

            Response.ContentType = "text/event-stream";
            Response.Headers["Cache-Control"] = "no-cache";
            Response.Headers["Connection"] = "keep-alive";
            Response.Headers["X-Accel-Buffering"] = "no"; // Disable buffering for Nginx

            try
            {
                // Create a StreamWriter that doesn't close the underlying stream when disposed
                using var writer = new StreamWriter(Response.Body, Encoding.UTF8, leaveOpen: true)
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

                    // Format as SSE with proper async methods
                    await writer.WriteAsync($"data: {chunk}\n\n");
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
                using var errorWriter = new StreamWriter(
                    Response.Body,
                    Encoding.UTF8,
                    leaveOpen: true
                )
                {
                    AutoFlush = true,
                };
                await errorWriter.WriteAsync($"data: Error: {ex.Message}\n\n");
                await errorWriter.FlushAsync();
            }
        }
    }
}
