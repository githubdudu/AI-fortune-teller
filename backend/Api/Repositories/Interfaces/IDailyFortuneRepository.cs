using Api.Models.Domain;

namespace Api.Repositories.Interfaces
{
    public interface IDailyFortuneRepository
    {
        Task<DailyFortune?> GetTodayFortuneAsync(Guid userId);
        Task<DailyFortune> CreateDailyFortuneAsync(Guid userId, string luckyColor, int luckyNumber, string advice);
    }
}