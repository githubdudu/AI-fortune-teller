using Api.Models.Domain;

namespace Api.Repositories.Interfaces
{
    public interface ICardRepository : IRepository<Card>
    {
        Task<IEnumerable<Card>> GetRandomCardsAsync(int? limit = null);
        /// <summary>
        /// Returns the cards for <paramref name="ids"/> in the same order as
        /// <paramref name="ids"/>. Callers rely on this: the order is the card
        /// positions in a spread. Ids with no matching card are skipped.
        /// </summary>
        Task<IEnumerable<Card>> GetCardsByIdsAsync(IEnumerable<Guid> ids);
    }
}
