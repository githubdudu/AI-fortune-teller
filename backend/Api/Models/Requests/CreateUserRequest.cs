using System.ComponentModel.DataAnnotations;

namespace Api.Models.Requests
{
    public class CreateUserRequest
    {
        // [Required]
        // [StringLength(50, MinimumLength = 3)]
        // public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string DisplayName { get; set; } = string.Empty;

        // Optional date of birth input
        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; } = null;

        // Optional gender input in integer format
        [Range(-1, 1)]
        public int? Gender { get; set; } = null;

        // Optional residence country input
        [StringLength(50)]
        public string? ResidenceCountry { get; set; } = null;

        // Optional born country input
        [StringLength(50)]
        public string? BornCountry { get; set; } = null;
    }
}
