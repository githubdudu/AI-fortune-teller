using Api.Data;
using Api.Models.Domain;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class ThemeRepository : GenericRepository<Theme>, IThemeRepository
    {
        public ThemeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Theme>> GetAllThemesAsync()
        {
            return await _context.Themes.ToListAsync();
        }

        public override async Task<Theme?> GetByIdAsync(Guid id)
        {
            return await _context.Themes.FindAsync(id);
        }
    }
}