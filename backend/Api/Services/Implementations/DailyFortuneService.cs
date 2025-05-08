using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Api.Repositories.Interfaces;
namespace Api.Services.Implementations
{
    public class DailyFortuneService : IDailyFortuneService
    {
        private readonly IDailyFortuneRepository _dailyFortuneRepository;

        private static readonly string[] Colors = { "Red", "Blue", "Green", "Yellow", "Orange", "Pink", "Navy", "Lime Green", "Baby Pink", "Coral", "Gray", "Khaki", "Beige", "Brown", "Mint", "Lavender", "Purple", "Black", "White" };
        private static readonly string[] Advices = {
            "Trust your instincts.",
            "Today is a good day to try something new.",
            "Patience will reward you.",
            "Be kind to someone unexpected.",
            "Stay curious and open-minded.",
            "Embrace change and growth.",
            "Listen more than you speak.",
            "Take time to reflect on your goals.",
            "Small steps lead to big achievements.",
            "Focus on what you can control.",
            "Practice gratitude daily.",
            "Be honest with yourself and others.",
            "Don’t be afraid to ask for help.",
            "Keep learning and expanding your skills.",
            "Take breaks to recharge your energy.",
            "Celebrate your progress, no matter how small.",
            "Be compassionate to yourself and others.",
            "Face challenges with courage.",
            "Stay positive even in tough times.",
            "Prioritize your mental health.",
            "Make time for the people you love.",
            "Avoid procrastination by starting now.",
            "Be open to new perspectives.",
            "Set clear and achievable goals.",
            "Take responsibility for your actions.",
            "Practice mindfulness and stay present.",
            "Keep your promises and commitments.",
            "Don’t compare yourself to others.",
            "Be generous with your time and resources.",
            "Learn from your mistakes.",
            "Stay humble and grounded.",
            "Express your creativity freely.",
            "Be patient with your progress.",
            "Seek balance in work and life.",
            "Communicate clearly and kindly.",
            "Trust the process, even if it’s slow.",
            "Be proactive, not reactive.",
            "Surround yourself with positive influences.",
            "Keep your environment organized.",
            "Take care of your physical health.",
            "Be a good listener.",
            "Stay motivated by your passions.",
            "Avoid unnecessary stress.",
            "Give yourself permission to rest.",
            "Challenge your fears.",
            "Be adaptable to new situations.",
            "Maintain a sense of humor.",
            "Focus on solutions, not problems.",
            "Help others without expecting reward.",
            "Be mindful of your words.",
            "Stay curious about the world.",
            "Practice self-discipline.",
            "Be authentic in your actions.",
            "Avoid negativity and drama.",
            "Celebrate others’ successes.",
            "Keep a journal of your thoughts.",
            "Spend time in nature regularly.",
            "Be generous with compliments.",
            "Take time to unplug from technology.",
            "Learn to forgive and let go.",
            "Stay committed to your values.",
            "Be open to constructive criticism.",
            "Invest in your personal growth.",
            "Avoid multitasking; focus on one thing.",
            "Practice deep breathing when stressed.",
            "Keep your goals visible.",
            "Be mindful of your spending.",
            "Plan your day the night before.",
            "Stay hydrated and eat well.",
            "Find joy in simple things.",
            "Be consistent in your efforts.",
            "Avoid gossip and negativity.",
            "Practice empathy in conversations.",
            "Keep challenging your comfort zone.",
            "Be respectful to everyone you meet.",
            "Learn to say no when necessary.",
            "Take responsibility for your happiness.",
            "Celebrate your uniqueness.",
            "Keep an open heart and mind.",
            "Be persistent in pursuing your dreams.",
            "Avoid overthinking decisions.",
            "Practice kindness daily.",
            "Stay organized to reduce stress.",
            "Focus on progress, not perfection.",
            "Be mindful of your digital footprint.",
            "Set boundaries to protect your energy.",
            "Seek out mentors and role models.",
            "Practice gratitude before sleep.",
            "Be curious about other cultures.",
            "Take time to meditate or pray.",
            "Avoid comparing your journey to others.",
            "Be patient with others’ growth.",
            "Stay true to your word.",
            "Celebrate small victories.",
            "Keep learning from every experience.",
            "Practice optimism in adversity.",
            "Be generous with your knowledge."
        };

        public DailyFortuneService(IDailyFortuneRepository dailyFortuneRepository)
        {
            _dailyFortuneRepository = dailyFortuneRepository;
        }

        public async Task<DailyFortuneDto> GetOrCreateDailyFortuneAsync(Guid userId)
        {
            var existing = await _dailyFortuneRepository.GetTodayFortuneAsync(userId);

            if (existing != null)
            {
                return new DailyFortuneDto
                {
                    LuckyColor = existing.LuckyColor,
                    LuckyNumber = existing.LuckyNumber,
                    Advice = existing.Advice
                };
            }

            var random = new Random();
            var newFortune = await _dailyFortuneRepository.CreateDailyFortuneAsync(
                userId,
                Colors[random.Next(Colors.Length)],
                random.Next(1, 100),
                Advices[random.Next(Advices.Length)]
            );

            return new DailyFortuneDto
            {
                LuckyColor = newFortune.LuckyColor,
                LuckyNumber = newFortune.LuckyNumber,
                Advice = newFortune.Advice
            };
        }
    }
}