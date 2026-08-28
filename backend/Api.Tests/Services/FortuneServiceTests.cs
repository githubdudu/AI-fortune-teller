using Api.Models.DTOs;
using Api.Models.Domain;
using Api.Models.Requests;
using Api.Repositories.Interfaces;
using Api.Services.Implementations;
using Api.Services.Interfaces;
using Moq;

namespace Api.Tests.Services
{
    /// <summary>
    /// Characterization tests for the prompt sent to OpenAI. They assert the
    /// ingredients (card names, theme, question, user detail) rather than the
    /// exact wording, so the prose can be reworded without breaking them.
    /// </summary>
    public class FortuneServiceTests
    {
        private readonly Mock<IOpenAIClient> _openAI = new();
        private readonly Mock<IThemeRepository> _themes = new();
        private readonly Mock<ICardRepository> _cards = new();
        private readonly Mock<IUserService> _users = new();
        private readonly FortuneService _service;

        private static readonly Guid ThemeId = Guid.NewGuid();
        private readonly CreateFortuneRequest _request = new()
        {
            Question = "Should I move to Wellington?",
            ThemeId = ThemeId,
            CardIds = [Guid.NewGuid(), Guid.NewGuid()],
            UserEmail = "ada@example.com",
        };

        public FortuneServiceTests()
        {
            _themes
                .Setup(t => t.GetByIdAsync(ThemeId))
                .ReturnsAsync(
                    new Theme
                    {
                        Id = ThemeId,
                        Name = "Love",
                        ImageSource = "love.png",
                        Description = "Matters of the heart",
                    }
                );

            _cards
                .Setup(c => c.GetCardsByIdsAsync(It.IsAny<IEnumerable<Guid>>()))
                .ReturnsAsync(
                    [
                        new Card
                        {
                            Id = Guid.NewGuid(),
                            Name = "The Fool",
                            Number = 0,
                            ImageSource = "fool.jpg",
                            Description = "New beginnings",
                            IsMajorArcana = true,
                        },
                        new Card
                        {
                            Id = Guid.NewGuid(),
                            Name = "The Magician",
                            Number = 1,
                            ImageSource = "magician.jpg",
                            Description = "Manifestation",
                            IsMajorArcana = true,
                        },
                    ]
                );

            _users
                .Setup(u => u.GetUserByEmailAsync("ada@example.com"))
                .ReturnsAsync(
                    new UserDto
                    {
                        Id = Guid.NewGuid(),
                        Email = "ada@example.com",
                        DisplayName = "Ada",
                        DateOfBirth = new DateTime(1990, 1, 2),
                        BornCountry = "New Zealand",
                        ResidenceCountry = "Australia",
                        Gender = 1,
                    }
                );

            _service = new FortuneService(
                _openAI.Object,
                _themes.Object,
                _cards.Object,
                _users.Object
            );
        }

        private static void AssertPromptIngredients(string prompt)
        {
            Assert.Contains("The Fool", prompt);
            Assert.Contains("The Magician", prompt);
            Assert.Contains("Love", prompt);
            Assert.Contains("Should I move to Wellington?", prompt);
            Assert.Contains("Ada", prompt);
            Assert.Contains("1990-01-02", prompt);
            Assert.Contains("New Zealand", prompt);
            Assert.Contains("Australia", prompt);
        }

        [Fact]
        public async Task GenerateFortuneAsync_PromptIncludesCardsThemeQuestionAndUser()
        {
            string? prompt = null;
            _openAI
                .Setup(o => o.GenerateTextAsync(It.IsAny<string>()))
                .Callback<string>(p => prompt = p)
                .ReturnsAsync(new AiTextResult("a reading", "gpt-4o"));

            await _service.GenerateFortuneAsync(_request);

            Assert.NotNull(prompt);
            AssertPromptIngredients(prompt);
        }

        [Fact]
        public async Task GenerateFortuneStreamAsync_PromptIncludesCardsThemeQuestionAndUser()
        {
            string? prompt = null;
            _openAI
                .Setup(o => o.GenerateTextStreamAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .Returns(
                    (string p, CancellationToken _) =>
                    {
                        prompt = p;
                        return EmptyStream();
                    }
                );

            await foreach (var _ in _service.GenerateFortuneStreamAsync(_request)) { }

            Assert.NotNull(prompt);
            AssertPromptIngredients(prompt);
        }

#pragma warning disable CS1998 // no awaits: the test only needs an empty stream
        private static async IAsyncEnumerable<AiStreamChunk> EmptyStream()
        {
            yield break;
        }
#pragma warning restore CS1998
    }
}
