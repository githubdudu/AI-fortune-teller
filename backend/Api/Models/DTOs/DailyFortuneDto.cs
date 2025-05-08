namespace Api.Models.DTOs
{
    public class DailyFortuneDto
    {
        public required string LuckyColor { get; set; } = string.Empty;
        public int LuckyNumber { get; set; }
        public required string Advice { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}