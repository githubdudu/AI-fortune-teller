using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Repositories.Interfaces;
using Api.Services.Implementations;
using Moq;
using Xunit;

namespace Api.Tests.Services
{
    public class CardServiceTests
    {
        private readonly Mock<ICardRepository> _mockCardRepository;
        private readonly CardService _cardService;

        public CardServiceTests()
        {
            _mockCardRepository = new Mock<ICardRepository>();
            _cardService = new CardService(_mockCardRepository.Object);
        }

        [Fact]
        public async Task GetAllCardsAsync_ReturnsAllCards()
        {
            var cards = new List<Card>
            {
                new Card
                {
                    Id = Guid.NewGuid(),
                    Name = "The Fool",
                    Number = 0,
                    ImageSource = "fool.jpg",
                    Description = "New beginnings",
                    IsMajorArcana = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Card
                {
                    Id = Guid.NewGuid(),
                    Name = "The Magician",
                    Number = 1,
                    ImageSource = "magician.jpg",
                    Description = "Manifestation",
                    IsMajorArcana = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _mockCardRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(cards);

            var result = await _cardService.GetAllCardsAsync();

            var resultList = result.ToList();
            Assert.Equal(2, resultList.Count);
            Assert.Equal("The Fool", resultList[0].Name);
            Assert.Equal("The Magician", resultList[1].Name);
            Assert.Equal(0, resultList[0].Number);
            Assert.Equal(1, resultList[1].Number);
            Assert.True(resultList[0].IsMajorArcana);
            Assert.True(resultList[1].IsMajorArcana);
        }

        [Fact]
        public async Task GetRandomCardsAsync_WithLimit_ReturnsLimitedRandomCards()
        {
            int limit = 3;
            var cards = new List<Card>
            {
                new Card
                {
                    Id = Guid.NewGuid(),
                    Name = "The Fool",
                    Number = 0,
                    ImageSource = "fool.jpg",
                    Description = "New beginnings",
                    IsMajorArcana = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Card
                {
                    Id = Guid.NewGuid(),
                    Name = "The Magician",
                    Number = 1,
                    ImageSource = "magician.jpg",
                    Description = "Manifestation",
                    IsMajorArcana = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Card
                {
                    Id = Guid.NewGuid(),
                    Name = "The High Priestess",
                    Number = 2,
                    ImageSource = "high_priestess.jpg",
                    Description = "Intuition",
                    IsMajorArcana = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _mockCardRepository.Setup(repo => repo.GetRandomCardsAsync(limit))
                .ReturnsAsync(cards);

            var result = await _cardService.GetRandomCardsAsync(limit);

            var resultList = result.ToList();
            Assert.Equal(3, resultList.Count);
            Assert.All(resultList, card => Assert.True(card.IsMajorArcana));
        }

        [Fact]
        public async Task GetRandomCardsAsync_WithoutLimit_ReturnsAllRandomCards()
        {
            var cards = new List<Card>
            {
                new Card { Id = Guid.NewGuid(), Name = "The Fool", Number = 0, ImageSource = "fool.jpg", Description = "New beginnings", IsMajorArcana = true },
                new Card { Id = Guid.NewGuid(), Name = "The Magician", Number = 1, ImageSource = "magician.jpg", Description = "Manifestation", IsMajorArcana = true },
                new Card { Id = Guid.NewGuid(),Name = "The High Priestess", Number = 2, ImageSource = "high_priestess.jpg", Description = "Intuition", IsMajorArcana = true },
                new Card { Id = Guid.NewGuid(), Name = "The Empress", Number = 3, ImageSource = "empress.jpg", Description = "Abundance", IsMajorArcana = true },
                new Card { Id = Guid.NewGuid(), Name = "The Emperor", Number = 4, ImageSource = "emperor.jpg", Description = "Authority", IsMajorArcana = true }
            };

            _mockCardRepository.Setup(repo => repo.GetRandomCardsAsync(null))
                .ReturnsAsync(cards);

            var result = await _cardService.GetRandomCardsAsync();

            var resultList = result.ToList();
            Assert.Equal(5, resultList.Count);
            Assert.All(resultList, card => Assert.True(card.IsMajorArcana));
        }

        [Fact]
        public async Task GetCardByIdAsync_WithExistingId_ReturnsCard()
        {
            var cardId = Guid.NewGuid();
            var card = new Card
            {
                Id = cardId,
                Name = "The Fool",
                Number = 0,
                ImageSource = "fool.jpg",
                Description = "New beginnings",
                IsMajorArcana = true,
                Suit = null,
                CreatedAt = DateTime.UtcNow
            };

            _mockCardRepository.Setup(repo => repo.GetByIdAsync(cardId))
                .ReturnsAsync(card);

            var result = await _cardService.GetCardByIdAsync(cardId);

            Assert.NotNull(result);
            Assert.Equal(cardId, result.Id);
            Assert.Equal("The Fool", result.Name);
            Assert.Equal(0, result.Number);
            Assert.Equal("fool.jpg", result.ImageSource);
            Assert.Equal("New beginnings", result.Description);
            Assert.True(result.IsMajorArcana);
            Assert.Null(result.Suit);
        }

        [Fact]
        public async Task GetCardByIdAsync_WithNonExistingId_ReturnsNull()
        {
            var cardId = Guid.NewGuid();

            _mockCardRepository.Setup(repo => repo.GetByIdAsync(cardId))
                .ReturnsAsync((Card?)null);

            var result = await _cardService.GetCardByIdAsync(cardId);

            Assert.Null(result);
        }

        [Fact]
        public async Task MapCardToDto_MapsAllProperties()
        {
            var cardId = Guid.NewGuid();
            var createdAt = DateTime.UtcNow.AddDays(-1);
            var updatedAt = DateTime.UtcNow;

            var card = new Card
            {
                Id = cardId,
                Name = "Two of Cups",
                Number = 2,
                ImageSource = "two_cups.jpg",
                Description = "Partnership",
                IsMajorArcana = false,
                Suit = "Cups",
                CreatedAt = createdAt,
                UpdatedAt = updatedAt
            };

            _mockCardRepository.Setup(repo => repo.GetByIdAsync(cardId))
                .ReturnsAsync(card);

            var result = await _cardService.GetCardByIdAsync(cardId);

            Assert.NotNull(result);
            Assert.Equal(cardId, result.Id);
            Assert.Equal("Two of Cups", result.Name);
            Assert.Equal(2, result.Number);
            Assert.Equal("two_cups.jpg", result.ImageSource);
            Assert.Equal("Partnership", result.Description);
            Assert.False(result.IsMajorArcana);
            Assert.Equal("Cups", result.Suit);
            Assert.Equal(createdAt, result.CreatedAt);
            Assert.Equal(updatedAt, result.UpdatedAt);
        }
    }
}