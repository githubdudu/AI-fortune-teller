using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Api.Services.Implementations
{
    public class OpenAIClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;

        public OpenAIClient(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration.GetValue<string>("ExternalServices:OpenAI:ApiKey")
                ?? throw new ArgumentNullException("OpenAI ApiKey is not configured");
            _baseUrl = configuration.GetValue<string>("ExternalServices:OpenAI:BaseUrl")
                ?? "https://api.openai.com/v1";
        }

        public async Task<string> GenerateTextAsync(string prompt)
        {
            var requestBody = new
            {
                model = "gpt-4",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync($"{_baseUrl}/chat/completions", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            using var jsonDoc = JsonDocument.Parse(responseBody);
            var result = jsonDoc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return result ?? string.Empty;
        }
    }
}