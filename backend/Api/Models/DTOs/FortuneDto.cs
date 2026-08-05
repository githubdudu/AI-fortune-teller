namespace Api.Models.DTOs
{
    public class FortuneDto
    {
        public Guid Id { get; set; }
        public string Result { get; set; } = string.Empty;
        public Guid ThemeId { get; set; }
        public required Guid[] CardsIds { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public string UserEmail { get; set; } = string.Empty;

        /// <summary>Model the AI provider actually used for this reading.</summary>
        public string? Model { get; set; }
    }
}