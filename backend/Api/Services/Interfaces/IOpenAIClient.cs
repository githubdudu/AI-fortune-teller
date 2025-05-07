namespace Api.Services.Interfaces
{
    public interface IOpenAIClient
    {
        Task<string> GenerateTextAsync(string prompt);
    }
}
