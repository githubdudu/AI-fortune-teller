using Api.Models.Domain;

namespace Api.Repositories.Interfaces
{
    public interface IFortuneRepository : IRepository<Fortune>
    {
        Task<IEnumerable<Fortune>> GetAllFortunesAsync();

        Task<IEnumerable<Fortune>> GetFortunesByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}