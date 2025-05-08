using Api.Services.Interfaces;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace Api.Services.Implementations
{
    public class FirebaseAuthService : IFirebaseAuthService
    {
        private readonly FirebaseApp _firebaseApp;

        public FirebaseAuthService(IConfiguration configuration)
        {
            // Initialize Firebase Admin SDK if it hasn't been already
            if (FirebaseApp.DefaultInstance == null)
            {
                var credentialsPath =
                    configuration["Firebase:CredentialsPath"]
                    ?? throw new InvalidOperationException(
                        "Firebase:CredentialsPath configuration is missing"
                    );

                _firebaseApp = FirebaseApp.Create(
                    new AppOptions { Credential = GoogleCredential.FromFile(credentialsPath) }
                );
            }
            else
            {
                _firebaseApp = FirebaseApp.DefaultInstance;
            }
        }

        public async Task<FirebaseUser?> VerifyTokenAsync(string token)
        {
            try
            {
                var decodedToken = await FirebaseAuth
                    .GetAuth(_firebaseApp)
                    .VerifyIdTokenAsync(token);

                return new FirebaseUser
                {
                    Uid = decodedToken.Uid,
                    Email = decodedToken.Claims.TryGetValue("email", out var email)
                        ? email?.ToString() ?? string.Empty
                        : string.Empty,
                    DisplayName = decodedToken.Claims.TryGetValue("name", out var name)
                        ? name?.ToString()
                        : null,
                    EmailVerified =
                        decodedToken.Claims.TryGetValue("email_verified", out var verified)
                        && verified is bool emailVerified
                        && emailVerified,
                };
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
