namespace Api.Models.DTOs
{
    public class CardDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Number { get; set; } = 0;
        public string ImageSource { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsMajorArcana { get; set; } = false;
        public string? Suit { get; set; } = null; // if minor arcana: Cups, Wands, Swords, Pentacles
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
