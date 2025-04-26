using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services.Implementations
{
    public class CardService : ICardService
    {
        private readonly ICardRepository _cardRepository;

        public CardService(ICardRepository cardRepository)
        {
            _cardRepository = cardRepository;
        }

        public async Task<IEnumerable<CardDto>> GetAllCardsAsync()
        {
            var cards = await _cardRepository.GetAllAsync();
            return cards.Select(MapCardToDto);
        }

        public async Task<IEnumerable<CardDto>> GetRandomCardsAsync(int? limit = null)
        {
            var cards = await _cardRepository.GetRandomCardsAsync(limit);
            return cards.Select(MapCardToDto);
        }

        public async Task<CardDto?> GetCardByIdAsync(Guid id)
        {
            var card = await _cardRepository.GetByIdAsync(id);
            return card != null ? MapCardToDto(card) : null;
        }

        // Add the MapCardToDto method here
        private static CardDto MapCardToDto(Card card)
        {
            return new CardDto
            {
                Id = card.Id,
                Name = card.Name,
                Number = card.Number,
                ImageSource = card.ImageSource,
                Description = card.Description,
                IsMajorArcana = card.IsMajorArcana,
                Suit = card.Suit,
                CreatedAt = card.CreatedAt,
                UpdatedAt = card.UpdatedAt,
            };
        }
    }
}
