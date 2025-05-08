using Api.Models.DTOs;

namespace Api.Services.Interfaces
{
    public interface IDailyFortuneService
    {
        Task<DailyFortuneDto> GetOrCreateDailyFortuneByEmailAsync(string userEmail);
    }
}