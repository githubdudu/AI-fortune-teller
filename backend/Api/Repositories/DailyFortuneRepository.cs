using Api.Data;
using Api.Models.Domain;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class DailyFortuneRepository : GenericRepository<DailyFortune>, IDailyFortuneRepository
    {
        private readonly ApplicationDbContext _context;

        public DailyFortuneRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<DailyFortune?> GetTodayFortuneAsync(Guid userId)
        {
            var today = DateTime.UtcNow.Date;

            return await _context.DailyFortunes
                .FirstOrDefaultAsync(f => f.UserId == userId && f.CreatedAt.Date == today);
        }

        public async Task<DailyFortune> CreateDailyFortuneAsync(Guid userId, string luckyColor, int luckyNumber, string advice)
        {
            var newFortune = new DailyFortune
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LuckyColor = luckyColor,
                LuckyNumber = luckyNumber,
                Advice = advice,
                CreatedAt = DateTime.UtcNow
            };

            _context.DailyFortunes.Add(newFortune);
            await _context.SaveChangesAsync();
            return newFortune;
        }
    }
}