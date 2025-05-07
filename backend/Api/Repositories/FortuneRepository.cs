using Api.Data;
using Api.Models.Domain;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class FortuneRepository : GenericRepository<Fortune>, IFortuneRepository
    {
        public FortuneRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Fortune>> GetAllFortunesAsync()
        {
            return await _context.Fortunes
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Fortune>> GetFortunesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Fortunes
                .Where(f => f.CreatedAt >= startDate &&
                           f.CreatedAt <= endDate)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }
    }
}