using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Api.Models.DTOs;

namespace Api.Services.Interfaces
{
    public interface IOpenAIClient
    {
        Task<AiTextResult> GenerateTextAsync(string prompt);
        IAsyncEnumerable<AiStreamChunk> GenerateTextStreamAsync(
            string prompt,
            CancellationToken cancellationToken = default
        );
    }
}
