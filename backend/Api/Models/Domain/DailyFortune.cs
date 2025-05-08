using System;

namespace Api.Models.Domain
{
    public class DailyFortune
    {
        public Guid Id { get; set; }
        public required string Email { get; set; } = string.Empty;
        public required string LuckyColor { get; set; } = string.Empty;
        public int LuckyNumber { get; set; }
        public required string Advice { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
