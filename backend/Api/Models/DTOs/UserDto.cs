namespace Api.Models.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }

        // public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; } = null;
        public int? Gender { get; set; } = null; // -1: Unknown
        public string? ResidenceCountry { get; set; } = null; // Optional
        public string? BornCountry { get; set; } = null; // Optional
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
