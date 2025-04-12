using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

// Set token parameters - update these values to match your appsettings.json
// These must match EXACTLY with what's in your API configuration
// The values in your appsettings.json are:
// "JwtSettings": {
//    "Secret": "your-secret-key-here",
//    "Issuer": "your-issuer",
//    "Audience": "your-audience",
//    "ExpiryInMinutes": 60
// }

// IMPORTANT: The secret key must be at least 32 characters long for HMAC-SHA256
var secret = "your-secret-key-here-must-be-at-least-32-chars";  // Must match JwtSettings:Secret in appsettings.json
var issuer = "your-issuer";            // Must match JwtSettings:Issuer in appsettings.json
var audience = "your-audience";        // Must match JwtSettings:Audience in appsettings.json

// Set expiration to 10 years from now for testing
var expiryDate = DateTime.UtcNow.AddYears(10);

var tokenHandler = new JwtSecurityTokenHandler();
var key = Encoding.UTF8.GetBytes(secret);

var tokenDescriptor = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.Name, "Test User"),
        new Claim(JwtRegisteredClaimNames.Email, "test@example.com"),
        new Claim("role", "Admin")
    }),
    Expires = expiryDate,
    Issuer = issuer,
    Audience = audience,
    SigningCredentials = new SigningCredentials(
        new SymmetricSecurityKey(key),
        SecurityAlgorithms.HmacSha256Signature)
};

var token = tokenHandler.CreateToken(tokenDescriptor);
var tokenString = tokenHandler.WriteToken(token);

Console.WriteLine($"Token: {tokenString}");
Console.WriteLine($"Expires: {expiryDate}");
Console.WriteLine("\nUse this token in the Authorization header as:");
Console.WriteLine($"Authorization: Bearer {tokenString}");
