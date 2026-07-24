using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Services.Interfaces
{
    public interface IOpenAIClient
    {
        Task<string> GenerateTextAsync(string prompt, string accountKey);
        IAsyncEnumerable<string> GenerateTextStreamAsync(
            string prompt,
            string accountKey,
            CancellationToken cancellationToken = default
        );
    }
}
