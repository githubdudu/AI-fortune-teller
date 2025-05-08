using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Api.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IFirebaseAuthService _firebaseAuthService;

        public AuthController(
            IUserService userService,
            IConfiguration configuration,
            IFirebaseAuthService firebaseAuthService
        )
        {
            _userService = userService;
            _configuration = configuration;
            _firebaseAuthService = firebaseAuthService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] FirebaseLoginRequest request)
        {
            try
            {
                // Verify Firebase token
                var firebaseUser = await _firebaseAuthService.VerifyTokenAsync(
                    request.FirebaseToken
                );

                if (firebaseUser == null)
                {
                    return Unauthorized(new { message = "Invalid Firebase token" });
                }

                // Check if user exists in your system by email
                var user = await _userService.GetUserByEmailAsync(firebaseUser.Email);

                // If user doesn't exist, create one
                if (user == null)
                {
                    var createRequest = new CreateUserRequest
                    {
                        Email = firebaseUser.Email,
                        DisplayName = firebaseUser.DisplayName ?? firebaseUser.Email.Split('@')[0],
                    };

                    user = await _userService.CreateUserAsync(createRequest);
                }

                // Generate JWT token for your API
                var token = GenerateJwtToken(user);

                // Set token in HTTP-only cookie
                SetTokenCookie(token);

                // Return user info without the token in body
                return Ok(new { user });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private string GenerateJwtToken(UserDto user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["JwtSettings:Secret"]
                        ?? "your-secret-key-here-must-be-at-least-32-chars"
                )
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"] ?? "your-issuer",
                audience: _configuration["JwtSettings:Audience"] ?? "your-audience",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(_configuration["JwtSettings:ExpiryInMinutes"] ?? "60")
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SetTokenCookie(string token)
        {
            // Get cookie settings from configuration
            var cookieSecure =
                bool.TryParse(_configuration["JwtSettings:CookieSecure"], out var secure) && secure;
            var cookieSameSite = _configuration["JwtSettings:CookieSameSite"]?.ToLower() switch
            {
                "strict" => SameSiteMode.Strict,
                "lax" => SameSiteMode.Lax,
                "none" => SameSiteMode.None,
                _ => SameSiteMode.Lax, // Default to Lax
            };

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = cookieSecure, // Should be true in production
                SameSite = cookieSameSite,
                Expires = DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(_configuration["JwtSettings:ExpiryInMinutes"] ?? "60")
                ),
            };

            Response.Cookies.Append("auth_token", token, cookieOptions);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Clear the auth cookie
            Response.Cookies.Delete(
                "auth_token",
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure =
                        bool.TryParse(_configuration["JwtSettings:CookieSecure"], out var secure)
                        && secure,
                    SameSite = _configuration["JwtSettings:CookieSameSite"]?.ToLower() switch
                    {
                        "strict" => SameSiteMode.Strict,
                        "lax" => SameSiteMode.Lax,
                        "none" => SameSiteMode.None,
                        _ => SameSiteMode.Lax,
                    },
                }
            );

            return Ok(new { message = "Logged out successfully" });
        }
    }
}
