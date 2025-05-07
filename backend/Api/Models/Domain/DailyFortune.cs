using System;

namespace Api.Models.Domain
{
    public class DailyFortune
    {
        public Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required string LuckyColor { get; set; }
        public required int LuckyNumber { get; set; }
        public required string Advice { get; set; }
        public DateTime? UpdatedAt { get; set; } // Nullable to allow for cards that have not been updated
    }
}
