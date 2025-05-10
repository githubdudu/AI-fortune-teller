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
        private readonly IUserService _userService;

        public FortuneService(
            IOpenAIClient openAIClient,
            IThemeRepository themeRepository,
            ICardRepository cardRepository,
            IUserService userService
        )
        {
            _openAIClient = openAIClient;
            _themeRepository = themeRepository;
            _cardRepository = cardRepository;
            _userService = userService;
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

                UserDto? user = null;
                string userDetail = "";

                if (!string.IsNullOrEmpty(request.UserEmail))
                {
                    user = await _userService.GetUserByEmailAsync(request.UserEmail);
                    if (user != null)
                    {
                        string birthDate = user.DateOfBirth.HasValue
                            ? user.DateOfBirth.Value.ToString("yyyy-MM-dd")
                            : "unknown date";

                        userDetail = $"The reading is for {user.DisplayName}, born on {birthDate}, born in {user.BornCountry}, currently living in {user.ResidenceCountry} and who's gender is {user.Gender}";
                    }
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

                    string promptFormat =
                        request.Question != string.Empty
                            ? "Return a fortune reading using the following structure: CardName: This should be the tarot card name used for this section. Interpretation: Nearly a 20 sentence reading, poetic and wise in tone, include symbolic insight and emotional guidance, tie it back to the user's question. Repeat this for each card, only return the formatted reading. Don't respond to my question like Certainly I can do that for you! kind of response. I only want the fortune reading result. Include a person to person fortune telling style, using the given user's first name, and be specific with the result using the user's gender, age, place of birth, and place of residence"
                            : "Return a fortune reading using the following structure: CardName: This should be the tarot card name used for this section. Interpretation: Nearly a 20 sentence reading, poetic and wise in tone, include symbolic insight and emotional guidance, tie it back to the user's chosen theme.  Don't respond to my question like Certainly I can do that for you! kind of response. I only want the fortune reading result. Include a person to person fortune telling style, using the given user's first name, and be specific with the result using the user's gender, age, place of birth, and place of residence";

                    string prompt =
                        request.Question != string.Empty
                            ? $"You are a tarot oracle with a supernatural reputation — your clients pay millions because your readings are always on point, intuitive, and uncannily accurate. {userDetail}. Based on the question: '{request.Question}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading. {promptFormat}"
                            : $"You are a tarot oracle with a supernatural reputation — your clients pay millions because your readings are always on point, intuitive, and uncannily accurate. {userDetail}. For the theme of '{chosenTheme}' and using these cards: {cardNames}, create a deeply insightful, mystical, and encouraging tarot reading. {promptFormat}";

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
                        UserEmail = user.Email
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
