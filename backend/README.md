# Backend Project Structure

This directory contains the backend components for the application, organized into three main sections:

## Directory Structure

- **Api**: The main ASP.NET Core Web API application
- **Api.Tests**: Unit and integration tests for the API
- **Tools**: Utility tools to support development and testing

## Api

The Api directory contains the main web application built with ASP.NET Core. It follows a clean architecture pattern with:

- **Controllers**: API endpoints organized by version
- **Models**: Data models including domain entities, DTOs, and request/response objects
- **Services**: Business logic implementation with interface-based design
- **Repositories**: Data access layer with generic repository pattern
- **Middleware**: Custom middleware components for cross-cutting concerns
- **Infrastructure**: Configuration and setup code

The API uses JWT authentication, Swagger for API documentation, and supports API versioning. It runs on port 5000 (HTTP) and 5001 (HTTPS) by default.

## Api.Tests

The Api.Tests directory contains unit and integration tests for the API components. Tests are organized to mirror the structure of the main API:

- **Services**: Tests for service-layer business logic
- More test categories will be added as the application grows

Tests use xUnit as the testing framework and Moq for mocking dependencies.

## Tools

The Tools directory contains utility applications and scripts to support development and testing:

### TokenGenerator

The TokenGenerator is a simple console application that generates JWT tokens for testing the API. To use it:

```bash
cd backend/Tools/TokenGenerator
dotnet run
```

This will generate a JWT token that can be used for authenticated API requests during testing.

> **Note**: The TokenGenerator needs to use the exact same JWT configuration as your API to generate valid tokens. If your tokens are not working, check that the following values match in both `TokenGenerator/Program.cs` and `Api/appsettings.json`:
> - Secret key
> - Issuer
> - Audience
> - Signing algorithm

## JWT Token Configuration Fix

If you're having issues with the generated JWT tokens, the TokenGenerator has been updated to use placeholder values that match the structure in `appsettings.json`. You need to:

1. Check the values in `backend/Api/appsettings.json` under the `JwtSettings` section
2. Copy those exact same values to `backend/Tools/TokenGenerator/Program.cs`:
   - `secret` should match `JwtSettings:Secret` in appsettings.json
   - `issuer` should match `JwtSettings:Issuer` in appsettings.json
   - `audience` should match `JwtSettings:Audience` in appsettings.json

By default, appsettings.json has these placeholder values:
```json
"JwtSettings": {
  "Secret": "your-secret-key-here-must-be-at-least-32-chars",
  "Issuer": "your-issuer",
  "Audience": "your-audience",
  "ExpiryInMinutes": 60
}
```

And the TokenGenerator now has matching placeholders:
```csharp
var secret = "your-secret-key-here-must-be-at-least-32-chars";  // Must match JwtSettings:Secret
var issuer = "your-issuer";            // Must match JwtSettings:Issuer
var audience = "your-audience";        // Must match JwtSettings:Audience
```

**IMPORTANT**: The secret key MUST be at least 32 characters long for HMAC-SHA256 algorithm. If the key is shorter, you'll get a cryptographic error when generating tokens.

Replace these placeholder values with real values in BOTH files. Ensure your custom secret key is at least 32 characters long and sufficiently random for security.

For example, you might update both files to use:
```
Secret: "mySuperSecretKey123456789012345678901234"
Issuer: "myapp-api"
Audience: "myapp-client"
```

To use the token in API requests, include it in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

## Getting Started

To run the complete backend:

```bash
cd backend/Api
dotnet run
```

To run the tests:

```bash
cd backend/Api.Tests
dotnet test
```

To generate a JWT token for testing:

```bash
cd backend/Tools/TokenGenerator
dotnet run
``` 