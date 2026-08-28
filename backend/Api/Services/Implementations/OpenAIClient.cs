using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Api.Models.DTOs;
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

                _model = "dots-studio/dots-3-note-preview:free";

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

        public async Task<AiTextResult> GenerateTextAsync(string prompt)
        {
            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(prompt);
                // completion.Model is the model OpenRouter resolved the alias to
                return new AiTextResult(
                    completion.Content[0].Text ?? string.Empty,
                    string.IsNullOrEmpty(completion.Model) ? null : completion.Model
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GenerateTextAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw new Exception("Failed to generate text from OpenAI, model: " + _model, ex);
            }
        }

        public async IAsyncEnumerable<AiStreamChunk> GenerateTextStreamAsync(
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

            // OpenRouter resolves aliases like "openrouter/free" to a concrete model and
            // reports it on every update; report it once, on the first update that has it.
            string? reportedModel = null;

            // The yield statements are outside of any try-catch block
            await foreach (var update in completionUpdates.WithCancellation(cancellationToken))
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    yield break;
                }

                string? model = null;
                if (reportedModel == null && !string.IsNullOrEmpty(update.Model))
                {
                    reportedModel = update.Model;
                    model = update.Model;
                }

                var text =
                    update.ContentUpdate.Count > 0 ? update.ContentUpdate[0].Text ?? string.Empty
                    : string.Empty;

                // Empty updates are passed on rather than dropped: a reasoning model
                // sends nothing but those for up to a minute before its first visible
                // token, and the controller turns them into keepalive pings.
                yield return new AiStreamChunk(text, model);
            }
        }
    }
}
