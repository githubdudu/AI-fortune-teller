using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services.Implementations
{
    public class FortuneService : IFortuneService
    {
        private readonly OpenAIClient _openAIClient;
        private readonly IThemeRepository _themeRepository;
        private readonly ICardRepository _cardRepository;

        public FortuneService(
            OpenAIClient openAIClient,
            IThemeRepository themeRepository,
            ICardRepository cardRepository)
        {
            _openAIClient = openAIClient;
            _themeRepository = themeRepository;
            _cardRepository = cardRepository;
        }

        public async Task<FortuneDto> GenerateFortuneAsync(CreateFortuneRequest request)
        {
            // Validate the request
            if (!request.IsValid())
            {
                throw new ArgumentException("Either Question or ThemeId must be provided");
            }

            // Get theme details if ThemeId is provided
            string themeContext = string.Empty;
            if (request.ThemeId.HasValue)
            {
                var theme = await _themeRepository.GetByIdAsync(request.ThemeId.Value);
                themeContext = theme?.Name ?? throw new KeyNotFoundException("Theme not found");
            }

            // Get card details
            var cards = await _cardRepository.GetCardsByIdsAsync(request.CardIds);
            var cardNames = string.Join(", ", cards.Select(c => c.Name));

            // Build the prompt based on whether we have a question or theme
            string prompt = request.Question != string.Empty
                ? $"You are a professional tarot fortune teller. Based on the question: '{request.Question}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading."
                : $"You are a professional tarot fortune teller. For the theme of '{themeContext}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading.";

            // Generate fortune using OpenAI
            var fortuneResult = await _openAIClient.GenerateTextAsync(prompt);

            // Create and return DTO
            return new FortuneDto
            {
                Id = Guid.NewGuid(),
                Result = fortuneResult,
                ThemeId = request.ThemeId ?? Guid.Empty,
                CardsIds = request.CardIds,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}