using Api.Data;
using Api.Models.Domain;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class CardRepository : GenericRepository<Card>, ICardRepository
    {
        public CardRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Card>> GetAllCardsAsync()
        {
            return await _context.Cards.ToListAsync();
        }

        public async Task<IEnumerable<Card>> GetRandomCardsAsync(int? limit = null)
        {
            var query = _context.Cards.AsQueryable();

            if (limit.HasValue)
            {
                query = query.OrderBy(c => Guid.NewGuid()).Take(limit.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Card?> GetCardByIdAsync(Guid id)
        {
            return await _context.Cards.FindAsync(id);
        }

        public async Task<IEnumerable<Card>> GetCardsByIdsAsync(IEnumerable<Guid> ids)
        {
            var cards = await _context.Cards
                .Where(card => ids.Contains(card.Id))
                .ToDictionaryAsync(card => card.Id);

            // WHERE Id IN (...) carries no ORDER BY. 
            // Restore The caller's order here.
            return ids.Where(cards.ContainsKey).Select(id => cards[id]).ToList();
        }
    }
}
