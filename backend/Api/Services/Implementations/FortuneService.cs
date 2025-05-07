using System;
using System.Linq;
using System.Threading.Tasks;
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
            try
            {
                if (!request.IsValid())
                {
                    Console.WriteLine("Error: Either Question or ThemeId must be provided");
                    throw new Exception("Either Question or ThemeId must be provided");
                }

                string chosenTheme = string.Empty;
                if (request.ThemeId.HasValue)
                {
                    try
                    {
                        var theme = await _themeRepository.GetByIdAsync(request.ThemeId.Value);
                        chosenTheme =
                            theme?.Name
                            ?? throw new Exception($"Theme with ID {request.ThemeId} not found");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error retrieving theme: {ex.Message}");
                        throw;
                    }
                }

                try
                {
                    var cards = await _cardRepository.GetCardsByIdsAsync(request.CardIds);
                    if (cards == null || !cards.Any())
                    {
                        Console.WriteLine($"Error: No cards found with the provided IDs");
                        throw new Exception("No cards found with the provided IDs");
                    }

                    var cardNames = string.Join(", ", cards.Select(c => c.Name));

                    string prompt =
                        request.Question != string.Empty
                            ? $"You are a professional tarot fortune teller. Based on the question: '{request.Question}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading."
                            : $"You are a professional tarot fortune teller. For the theme of '{chosenTheme}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading.";

                    Console.WriteLine($"Sending prompt to OpenAI: {prompt}");
                    var fortuneResult = await _openAIClient.GenerateTextAsync(prompt);
                    Console.WriteLine($"Fortune result received from OpenAI");

                    return new FortuneDto
                    {
                        Id = Guid.NewGuid(),
                        Result = fortuneResult,
                        ThemeId = request.ThemeId ?? Guid.Empty,
                        CardsIds = request.CardIds,
                        CreatedAt = DateTime.UtcNow,
                    };
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error in fortune generation: {ex.Message}");
                    Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GenerateFortuneAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }
    }
}
