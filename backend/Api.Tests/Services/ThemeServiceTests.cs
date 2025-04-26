using Api.Models.Domain;
using Api.Models.Requests;
using Api.Repositories.Interfaces;
using Api.Services.Implementations;
using Moq;
using Xunit;

namespace Api.Tests.Services
{
    public class ThemeServiceTests
    {
        private readonly Mock<IThemeRepository> _mockThemeRepository;
        private readonly ThemeService _themeService;

        public ThemeServiceTests()
        {
            _mockThemeRepository = new Mock<IThemeRepository>();
            _themeService = new ThemeService(_mockThemeRepository.Object);
        }

        [Fact]
        public async Task GetAllThemesAsync_ReturnsAllThemes()
        {
            var themes = new List<Theme>
            {
                new Theme { Id = Guid.NewGuid(), Name = "general", ImageSource = "icons/general.png", Description = "Embrace your optimism and strive for fulfilment, but stay open to new experiences along your journey." },
                new Theme { Id = Guid.NewGuid(), Name = "love", ImageSource = "icons/love.png", Description = "Open your heart to deep emotional connections, and reflect on current feelings or new romantic beginnings." },
            };

            _mockThemeRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(themes);

            var result = await _themeService.GetAllThemesAsync();

            Assert.Equal(2, result.Count());
            Assert.Equal(themes[0].Name, result.First().Name);
            Assert.Equal(themes[1].Name, result.Last().Name);
        }

        [Fact]
        public async Task GetThemeByIdAsync_WithExistingId_ReturnsTheme()
        {
            var themeId = Guid.NewGuid();
            var theme = new Theme { Id = themeId, Name = "general", ImageSource = "icons/general.png", Description = "Embrace your optimism and strive for fulfilment, but stay open to new experiences along your journey." };

            _mockThemeRepository.Setup(repo => repo.GetByIdAsync(themeId)).ReturnsAsync(theme);

            var result = await _themeService.GetThemeByIdAsync(themeId);

            Assert.NotNull(result);
            Assert.Equal(themeId, result.Id);
            Assert.Equal("general", result.Name);
        }


        [Fact]
        public async Task GetThemeByIdAsync_WithNonExistingId_ReturnsNull()
        {
            var themeId = Guid.NewGuid();

            _mockThemeRepository.Setup(repo => repo.GetByIdAsync(themeId)).ReturnsAsync((Theme)null);

            var result = await _themeService.GetThemeByIdAsync(themeId);

            Assert.Null(result);
        }
    }
}