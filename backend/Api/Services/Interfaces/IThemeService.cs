using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Models.Requests;

namespace Api.Services.Interfaces
{
    public interface IThemeService
    {
        Task<IEnumerable<ThemeDto>> GetAllThemesAsync();
        Task<ThemeDto?> GetThemeByIdAsync(Guid id);
    }
}