using Api.Models.DTOs;
using Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]

    public class ThemesController : ControllerBase
    {
        private readonly IThemeService _themeService;
        public ThemesController(IThemeService themeService)
        {
            _themeService = themeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThemeDto>>> GetThemes()
        {
            var themes = await _themeService.GetAllThemesAsync();
            return Ok(themes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ThemeDto>> GetTheme(Guid id)
        {
            var theme = await _themeService.GetThemeByIdAsync(id);
            if (theme == null)
            {
                return NotFound();
            }

            return Ok(theme);
        }
    }
}
