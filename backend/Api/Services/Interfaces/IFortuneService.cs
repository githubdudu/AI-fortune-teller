using Api.Models.DTOs;
using Api.Models.Requests;

namespace Api.Services.Interfaces
{
    public interface IFortuneService
    {
        Task<FortuneDto> GenerateFortuneAsync(CreateFortuneRequest request);
    }
}