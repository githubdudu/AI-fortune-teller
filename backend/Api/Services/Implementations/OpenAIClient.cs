using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Api.Exceptions;
using Api.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Chat;

namespace Api.Services.Implementations
{
    public class OpenAIClient : IOpenAIClient
    {
        private readonly ChatClient _chatClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly string _model;

        private const int RateLimitPermits = 20;
        private static readonly TimeSpan RateLimitWindow = TimeSpan.FromHours(1);

        private readonly PartitionedRateLimiter<string> _rateLimiter = PartitionedRateLimiter.Create<string, string>(
            accountKey =>
                RateLimitPartition.GetFixedWindowLimiter(
                    accountKey,
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = RateLimitPermits,
                        Window = RateLimitWindow,
                        QueueLimit = 0,
                    }
                )
        );

        public OpenAIClient(IConfiguration configuration)
        {
            try
            {
                _apiKey =
                    configuration.GetValue<string>("ExternalServices:OpenAI:ApiKey")
                    ?? throw new Exception("OpenAI ApiKey is not configured");

                _baseUrl =
                    configuration.GetValue<string>("ExternalServices:OpenAI:BaseUrl")
                    ?? "https://openrouter.ai/api/v1";

                _model = "openrouter/free";

                _chatClient = new(
                    model: _model,
                    credential: new ApiKeyCredential(_apiKey),
                    options: new OpenAIClientOptions()
                    {
                        Endpoint = new Uri(_baseUrl)
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error initializing OpenAIClient: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<string> GenerateTextAsync(string prompt, string accountKey)
        {
            using RateLimitLease lease = await _rateLimiter.AcquireAsync(accountKey, 1);
            if (!lease.IsAcquired)
            {
                throw new RateLimitExceededException(
                    $"GenerateTextAsync rate limit ({RateLimitPermits} per {RateLimitWindow.TotalHours}h) exceeded for account '{accountKey}'"
                );
            }

            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(prompt);
                return completion.Content[0].Text ?? string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GenerateTextAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw new Exception("Failed to generate text from OpenAI, model: " + _model, ex);
            }
        }

        public async IAsyncEnumerable<string> GenerateTextStreamAsync(
            string prompt,
            string accountKey,
            [EnumeratorCancellation] CancellationToken cancellationToken = default
        )
        {
            // Check cancellation before starting the request
            if (cancellationToken.IsCancellationRequested)
            {
                yield break;
            }

            using RateLimitLease lease = await _rateLimiter.AcquireAsync(
                accountKey,
                1,
                cancellationToken
            );
            if (!lease.IsAcquired)
            {
                throw new RateLimitExceededException(
                    $"GenerateTextStreamAsync rate limit ({RateLimitPermits} per {RateLimitWindow.TotalHours}h) exceeded for account '{accountKey}'"
                );
            }

            AsyncCollectionResult<StreamingChatCompletionUpdate>? completionUpdates = null;
            List<ChatMessage> messages = [new UserChatMessage(prompt)];

            try
            {
                completionUpdates = _chatClient.CompleteChatStreamingAsync(
                    messages,
                    cancellationToken: cancellationToken
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error starting streaming completion: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw new Exception("Failed to start streaming completion from OpenAI", ex);
            }

            // The yield statements are outside of any try-catch block
            await foreach (var update in completionUpdates.WithCancellation(cancellationToken))
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    yield break;
                }

                if (
                    update.ContentUpdate.Count > 0
                    && !string.IsNullOrEmpty(update.ContentUpdate[0].Text)
                )
                {
                    yield return update.ContentUpdate[0].Text;
                }
            }
        }
    }
}
