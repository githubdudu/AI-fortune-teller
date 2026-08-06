using System;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
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

                        userDetail =
                            $"The reading is for {user.DisplayName}, born on {birthDate}, born in {user.BornCountry}, currently living in {user.ResidenceCountry} and who's gender is {user.Gender}";
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
                        @"Return the fortune reading in the following markdown structure:

'# CardName

**Interpretation:** (Write a poetic, intuitive, and emotionally resonant reading of just 1 sentence. Speak in a mystical tone, rich with symbolic meaning and spiritual insight. Give emotional guidance and tie the interpretation deeply to the user’s chosen theme. Personalize the message using the user’s name, gender, age, place of birth, and place of residence. Speak directly to them as a person receiving a private reading. Avoid generic statements — be specific and immersive.)

---
'

Repeat the above section for each of the three cards, separating them with the markdown divider.

At the end, return a mystical summary paragraph that gently brings together the message of all three cards.
This summary should offer overall insight, clarity, and guidance, leaving the user with a sense of closure and wonder following the format below.

# Summary

Content

---";

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
                        Result = fortuneResult.Text,
                        ThemeId = request.ThemeId ?? Guid.Empty,
                        CardsIds = request.CardIds,
                        CreatedAt = DateTime.UtcNow,
                        UserEmail = user?.Email ?? string.Empty,
                        Model = fortuneResult.Model,
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

        public async IAsyncEnumerable<AiStreamChunk> GenerateFortuneStreamAsync(
            CreateFortuneRequest request,
            [EnumeratorCancellation] CancellationToken cancellationToken = default
        )
        {
            // Validate and prepare the data outside of the yielding section
            string prompt = await PreparePromptAsync(request);

            // Stream the response chunks - this part contains the yield statements
            // but no surrounding try-catch blocks
            await foreach (
                var chunk in _openAIClient.GenerateTextStreamAsync(prompt, cancellationToken)
            )
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    yield break;
                }

                yield return chunk;
            }

            // We've successfully streamed the entire fortune
            Console.WriteLine("Fortune stream completed");
        }

        // Helper method to prepare the prompt and handle exceptions
        private async Task<string> PreparePromptAsync(CreateFortuneRequest request)
        {
            try
            {
                if (!request.IsValid())
                {
                    Console.WriteLine("Error: Either Question or ThemeId must be provided");
                    throw new ArgumentException("Either Question or ThemeId must be provided");
                }

                UserDto? user = null;
                string userDetail = "";
                Console.WriteLine($"Fetching user details for email: {request.UserEmail}");

                if (!string.IsNullOrEmpty(request.UserEmail))
                {
                    user = await _userService.GetUserByEmailAsync(request.UserEmail);
                    if (user != null)
                    {
                        string birthDate = user.DateOfBirth.HasValue
                            ? user.DateOfBirth.Value.ToString("yyyy-MM-dd")
                            : "unknown date";

                        userDetail =
                            $"The reading is for {user.DisplayName}, born on {birthDate}, born in {user.BornCountry}, currently living in {user.ResidenceCountry} and who's gender is {user.Gender}";
                        Console.WriteLine($"User details fetched: {userDetail}");
                    }
                }

                string chosenTheme = string.Empty;
                if (request.ThemeId.HasValue)
                {
                    var theme = await _themeRepository.GetByIdAsync(request.ThemeId.Value);
                    chosenTheme =
                        theme?.Name
                        ?? throw new Exception($"Theme with ID {request.ThemeId} not found");
                }

                var cards = await _cardRepository.GetCardsByIdsAsync(request.CardIds);
                if (cards == null || !cards.Any())
                {
                    Console.WriteLine($"Error: No cards found with the provided IDs");
                    throw new Exception("No cards found with the provided IDs");
                }

                var cardNames = string.Join(", ", cards.Select(c => c.Name));

                string promptFormat =
                    @"Return the fortune reading in the following markdown structure:

'# CardName

**Interpretation:** (Write in a poetic and mystical tone, but ensure the message is clear, grounded, and personal. Each interpretation should contain two parts:  
1. A symbolic, intuitive insight tied to the user's theme.  
2. A direct yet gentle piece of guidance or reflection — something the user can *feel*, *do*, or *realize* in daily life.  
Address the user by name and include references to their gender, age, birthplace, and current residence to deepen intimacy. Avoid vague phrases or abstract generalizations — speak vividly and give emotionally resonant but specific advice.)

---
';

Repeat this for each of the three cards, using the markdown divider between them.

Then, provide a final reflection in this format:

# Summary

(Weave the meanings of the three cards into a cohesive message. End with a grounded spiritual takeaway and a practical suggestion or mantra the user can carry forward today. Let the user feel seen and gently guided.)

---";

                string prompt =
                    request.Question != string.Empty
                        ? $"You are a gifted tarot oracle with a mystical reputation for delivering specific, personal, and accurate guidance. Your readings are known for translating deep symbolism into real-world clarity. {userDetail}. Based on the question: '{request.Question}', and using these cards: {cardNames}, provide a tarot reading that is emotionally rich, intuitively deep, and practically helpful. Use the structure below: {promptFormat}"
                        : $"You are a gifted tarot oracle with a mystical reputation for delivering specific, personal, and accurate guidance. Your readings are known for translating deep symbolism into real-world clarity. {userDetail}. For the theme of '{chosenTheme}', and using these cards: {cardNames}, provide a tarot reading that is emotionally rich, intuitively deep, and practically helpful. Use the structure below: {promptFormat}";

                Console.WriteLine($"Sending streaming prompt to OpenAI: {prompt}");
                return prompt;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error preparing prompt: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw; // Rethrow to be handled by the controller
            }
        }
    }
}
