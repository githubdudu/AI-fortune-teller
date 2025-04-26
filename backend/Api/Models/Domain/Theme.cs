using System;

namespace Api.Models.Domain
{
    public class Theme
    {
        public Guid Id { get; set; }
        public required string Name { get; set; } // general, love, finance, career, relationships, health, decisions, travel
        public required string ImageSource { get; set; } // PNG
        public required string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } // Nullable to allow for themes that have not been updated
    }
}
