using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services.Implementations
{
    public class ThemeService : IThemeService
    {
        private readonly IThemeRepository _themeRepository;
        public ThemeService(IThemeRepository themeRepository)
        {
            _themeRepository = themeRepository;
        }

        public async Task<IEnumerable<ThemeDto>> GetAllThemesAsync()
        {
            var themes = await _themeRepository.GetAllAsync();
            return themes.Select(MapThemeToDto);
        }

        public async Task<ThemeDto?> GetThemeByIdAsync(Guid id)
        {
            var theme = await _themeRepository.GetByIdAsync(id);
            return theme != null ? MapThemeToDto(theme) : null;
        }

        private static ThemeDto MapThemeToDto(Theme theme)
        {
            return new ThemeDto
            {
                Id = theme.Id,
                Name = theme.Name,
                ImageSource = theme.ImageSource,
                Description = theme.Description,
                CreatedAt = theme.CreatedAt,
                UpdatedAt = theme.UpdatedAt,
            };
        }
    }
}