namespace Api.Models.DTOs
{
    /// <summary>
    /// A single piece of a streamed AI completion. <see cref="Model"/> carries the
    /// model the provider (OpenRouter) actually resolved the request to — it is only
    /// set on the first update that reports it, and is null on later chunks.
    /// </summary>
    public record AiStreamChunk(string Text, string? Model = null);

    /// <summary>
    /// A non-streamed AI completion together with the model the provider
    /// (OpenRouter) actually resolved the request to.
    /// </summary>
    public record AiTextResult(string Text, string? Model = null);
}
