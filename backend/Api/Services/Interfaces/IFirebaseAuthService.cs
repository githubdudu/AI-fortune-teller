namespace Api.Services.Interfaces
{
    public class FirebaseUser
    {
        public string Uid { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public bool EmailVerified { get; set; }
    }

    public interface IFirebaseAuthService
    {
        Task<FirebaseUser?> VerifyTokenAsync(string token);
    }
}
