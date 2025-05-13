using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
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

        public OpenAIClient(IConfiguration configuration)
        {
            try
            {
                _apiKey =
                    configuration.GetValue<string>("ExternalServices:OpenAI:ApiKey")
                    ?? throw new Exception("OpenAI ApiKey is not configured");

                _baseUrl =
                    configuration.GetValue<string>("ExternalServices:OpenAI:BaseUrl")
                    ?? "https://api.openai.com/v1";

                _chatClient = new ChatClient(model: "gpt-4o", apiKey: _apiKey);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error initializing OpenAIClient: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<string> GenerateTextAsync(string prompt)
        {
            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(prompt);
                return completion.Content[0].Text ?? string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GenerateTextAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw new Exception("Failed to generate text from OpenAI", ex);
            }
        }

        public async IAsyncEnumerable<string> GenerateTextStreamAsync(
            string prompt,
            [EnumeratorCancellation] CancellationToken cancellationToken = default
        )
        {
            // Check cancellation before starting the request
            if (cancellationToken.IsCancellationRequested)
            {
                yield break;
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
