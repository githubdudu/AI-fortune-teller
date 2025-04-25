using Api.Models.Domain;

namespace Api.Repositories.Interfaces
{
    public interface IThemeRepository : IRepository<Theme>
    {
        Task<Theme?> GetByIdAsync(int id);
    }
}