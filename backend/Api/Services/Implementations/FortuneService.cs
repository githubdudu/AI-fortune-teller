using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services.Implementations
{
    public class FortuneService : IFortuneService
    {
        private readonly IOpenAIClient _openAIClient;
        private readonly IThemeRepository _themeRepository;
        private readonly ICardRepository _cardRepository;

        public FortuneService(
            IOpenAIClient openAIClient,
            IThemeRepository themeRepository,
            ICardRepository cardRepository
        )
        {
            _openAIClient = openAIClient;
            _themeRepository = themeRepository;
            _cardRepository = cardRepository;
        }

        public async Task<FortuneDto> GenerateFortuneAsync(CreateFortuneRequest request)
        {
            if (!request.IsValid())
            {
                throw new Exception("Either Question or ThemeId must be provided");
            }

            string chosenTheme = string.Empty;
            if (request.ThemeId.HasValue)
            {
                var theme = await _themeRepository.GetByIdAsync(request.ThemeId.Value);
                chosenTheme = theme?.Name ?? throw new Exception("Theme not found");
            }

            var cards = await _cardRepository.GetCardsByIdsAsync(request.CardIds);
            var cardNames = string.Join(", ", cards.Select(c => c.Name));

            string prompt =
                request.Question != string.Empty
                    ? $"You are a professional tarot fortune teller. Based on the question: '{request.Question}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading."
                    : $"You are a professional tarot fortune teller. For the theme of '{chosenTheme}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading.";

            var fortuneResult = await _openAIClient.GenerateTextAsync(prompt);
            //For testing if OpenAIClient is working properly. Delete later.
            Console.WriteLine($"GPT >> {fortuneResult}");

            return new FortuneDto
            {
                Id = Guid.NewGuid(),
                Result = fortuneResult,
                ThemeId = request.ThemeId ?? Guid.Empty,
                CardsIds = request.CardIds,
                CreatedAt = DateTime.UtcNow,
            };
        }
    }
}
