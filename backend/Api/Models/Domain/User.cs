using System;

namespace Api.Models.Domain
{
    public class User
    {
        public Guid Id { get; set; }

        // public required string Username { get; set; }
        public required string Email { get; set; }
        public required string DisplayName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int? Gender { get; set; } // -1: Unknown,
        public string? ResidenceCountry { get; set; } // Optional
        public string? BornCountry { get; set; } // Optional
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
