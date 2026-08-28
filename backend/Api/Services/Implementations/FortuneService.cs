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

        private async Task<string> DescribeUserAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                return "";

            var user = await _userService.GetUserByEmailAsync(email);
            return user is null
                ? ""
                : $"The reading is for {user.DisplayName}, born on {user.DateOfBirth?.ToString("yyyy-MM-dd") ?? "unknown date"}, born in {user.BornCountry}, currently living in {user.ResidenceCountry} and who's gender is {user.Gender}";
        }

        // A reading can be theme-based, question-based, or both.
        private static string DescribeFocus(CreateFortuneRequest request, string chosenTheme)
        {
            var parts = new List<string>();

            if (request.ThemeId.HasValue)
                parts.Add($"on the theme of '{chosenTheme}'");

            if (!string.IsNullOrWhiteSpace(request.Question))
                parts.Add($"on the question: '{request.Question}'");

            return string.Join(" and ", parts);
        }

        public async Task<FortuneDto> GenerateFortuneAsync(CreateFortuneRequest request)
        {
            string prompt = await PreparePromptAsync(request);
            var fortuneResult = await _openAIClient.GenerateTextAsync(prompt);
            Console.WriteLine($"Fortune result received from OpenAI");

            return new FortuneDto
            {
                Id = Guid.NewGuid(),
                Result = fortuneResult.Text,
                ThemeId = request.ThemeId ?? Guid.Empty,
                CardsIds = request.CardIds,
                CreatedAt = DateTime.UtcNow,
                UserEmail = request.UserEmail,
                Model = fortuneResult.Model,
            };
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

        // Builds the prompt for both the one-shot and the streaming reading.
        private async Task<string> PreparePromptAsync(CreateFortuneRequest request)
        {
            if (!request.IsValid())
            {
                Console.WriteLine("Error: Either Question or ThemeId must be provided");
                throw new ArgumentException("Either Question or ThemeId must be provided");
            }

            Console.WriteLine($"Fetching user details for email: {request.UserEmail}");
            string userDetail = await DescribeUserAsync(request.UserEmail);
            Console.WriteLine($"User details fetched: {userDetail}");

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
                $"You are a gifted tarot oracle with a mystical reputation for delivering specific, personal, and accurate guidance. Your readings are known for translating deep symbolism into real-world clarity. {userDetail}. Focusing {DescribeFocus(request, chosenTheme)}, and using these cards: {cardNames}, provide a tarot reading that is emotionally rich, intuitively deep, and practically helpful. Use the structure below: {promptFormat}";

            Console.WriteLine($"Sending prompt to OpenAI");
            return prompt;
        }
    }
}
