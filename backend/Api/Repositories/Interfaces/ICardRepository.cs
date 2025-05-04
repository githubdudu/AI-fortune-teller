using Api.Models.Domain;

namespace Api.Repositories.Interfaces
{
    public interface ICardRepository : IRepository<Card>
    {
        Task<IEnumerable<Card>> GetRandomCardsAsync(int? limit = null);
        Task<IEnumerable<Card>> GetCardsByIdsAsync(IEnumerable<Guid> ids);
    }
}
