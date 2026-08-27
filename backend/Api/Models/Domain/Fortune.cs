using System.ComponentModel.DataAnnotations;

namespace Api.Models.Domain
{
    public class Fortune
    {
        public Guid Id { get; set; }
        public string Question { get; set; } = string.Empty;

        [Required]
        public string Result { get; set; } = string.Empty;
        public Guid ThemeId { get; set; }

        [Required]
        public Guid[] CardsIds { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}