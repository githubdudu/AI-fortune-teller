using System;

namespace Api.Models.Domain
{
    public class Card
    {
        public Guid Id { get; set; }
        public required string Name { get; set; } // Card name
        public required int Number { get; set; } // if major arcana: 0~21, else if minor arcana: 1~10
        public required string ImageSource { get; set; } // PNG
        public required string Description { get; set; } // Card description text
        public required bool IsMajorArcana { get; set; } // Indicates if the card is a major arcana or a minor arcana
        public string? Suit { get; set; } // if minor arcana: Cups, Wands, Swords, Pentacles
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } // Nullable to allow for cards that have not been updated
    }
}
