using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace Api.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger,
            IWebHostEnvironment env
        )
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = _env.IsDevelopment()
                ? new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = exception.Message,
                    Detail = exception.StackTrace,
                }
                : new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "An internal server error occurred.",
                    Detail = (string?)null,
                };

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }

    // Extension method for middleware registration
    public static class GlobalExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionMiddleware(
            this IApplicationBuilder builder
        )
        {
            return builder.UseMiddleware<GlobalExceptionMiddleware>();
        }
    }
}
