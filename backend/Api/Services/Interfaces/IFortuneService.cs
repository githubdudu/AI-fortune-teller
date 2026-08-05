using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Api.Models.DTOs;
using Api.Models.Requests;

namespace Api.Services.Interfaces
{
    public interface IFortuneService
    {
        Task<FortuneDto> GenerateFortuneAsync(CreateFortuneRequest request);
        IAsyncEnumerable<AiStreamChunk> GenerateFortuneStreamAsync(
            CreateFortuneRequest request,
            CancellationToken cancellationToken = default
        );
    }
}
