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

        public async Task<Theme?> GetByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}