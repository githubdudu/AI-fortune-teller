namespace Api.Models.DTOs
{
    public class FortuneDto
    {
        public Guid Id { get; set; }
        public string Result { get; set; } = string.Empty;
        public Guid ThemeId { get; set; }
        public required Guid[] CardsIds { get; set; }
        //Need to add user info

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}