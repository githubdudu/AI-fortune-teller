using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Services.Interfaces
{
    public interface IOpenAIClient
    {
        Task<string> GenerateTextAsync(string prompt);
        IAsyncEnumerable<string> GenerateTextStreamAsync(
            string prompt,
            CancellationToken cancellationToken = default
        );
    }
}
