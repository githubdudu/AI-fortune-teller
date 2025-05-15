using Api.Models.Domain;

namespace Api.Repositories.Interfaces
{
    public interface IDailyFortuneRepository
    {
        Task<DailyFortune?> GetTodayFortuneByEmailAsync(string userEmail);
        Task<DailyFortune> CreateDailyFortuneAsync(string userEmail, string luckyColor, int luckyNumber, string advice);
    }
}