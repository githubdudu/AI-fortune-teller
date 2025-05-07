using System;
using System.Threading.Tasks;
using Api.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using OpenAI.Chat;

namespace Api.Services.Implementations
{
    public class OpenAIClient : IOpenAIClient
    {
        private readonly ChatClient _chatClient;

        public OpenAIClient(IConfiguration configuration)
        {
            try
            {
                var apiKey =
                    configuration.GetValue<string>("ExternalServices:OpenAI:ApiKey")
                    ?? throw new Exception("OpenAI ApiKey is not configured");

                _chatClient = new ChatClient(model: "gpt-4o", apiKey: apiKey);
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
    }
}
