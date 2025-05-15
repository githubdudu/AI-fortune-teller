# ArcanaVerse Backend API

This is the backend API for the ArcanaVerse application, built with ASP.NET Core. It provides endpoints for managing fortune telling, tarot card readings, themes, and user profiles.

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Visual Studio](https://visualstudio.microsoft.com/) (optional)

## Running the Application

### Development Mode

To run the application in development mode:

```bash
cd backend/Api
dotnet run --environment Development
```

For hot reload during development:

```bash
dotnet watch run --environment Development
```

In development mode:
- Swagger UI is available at `/swagger`
- Detailed error information is returned in responses
- Hot reload is enabled (with `dotnet watch`)

### Production Mode

To run the application in production mode:

```bash
cd backend/Api
dotnet run --environment Production
```

Or build and run the published version:

```bash
dotnet publish -c Release
dotnet ./bin/Release/net8.0/Api.dll
```

In production mode:
- Swagger UI is still available at `/swagger` (as configured in this app)
- Generic error responses are returned (no sensitive details)
- Exception details are logged but not exposed to clients

## API Features

### Health Check

The API provides a health check endpoint:

```
GET /healthz
```

This endpoint is unauthenticated and returns a simple "Healthy" response when the API is running.

### Authentication

The API uses JWT authentication. To access protected endpoints:

1. Obtain a JWT token (implementation details will depend on your auth flow)
2. Include the token in the Authorization header: `Bearer {your-token}`

#### Firebase Authentication

The API also supports Firebase Authentication, using the service account credentials specified in `firebase-credentials.json`. Make sure this file is properly configured with your Firebase project details.

#### Generating JWT Tokens for Testing

A TokenGenerator tool is included in the project for creating test tokens. To generate a new token:

```bash
cd backend/Tools/TokenGenerator
dotnet run
```

This will output a token that's compatible with the API's current configuration. The token will be valid for 10 years, making it suitable for development and testing.

The TokenGenerator uses the same secret key, issuer, and audience as configured in the API to ensure compatibility.

> **Important**: The JWT secret key must be at least 32 characters long for HMAC-SHA256 algorithm. Both `appsettings.json` and `TokenGenerator/Program.cs` must have matching JWT configuration values.

You can modify the generator code in `TokenGenerator/Program.cs` to adjust claims or other token properties as needed.

### API Versioning

The API supports versioning through multiple methods:
- URL path: `/api/v1/users`
- Header: `X-Api-Version: 1.0`
- Query string: `?api-version=1.0`

This allows for evolving the API over time while maintaining backward compatibility.

#### Versioning Strategy

We follow these versioning principles:

1. **Major Version Changes** (v1 → v2):
   - Breaking changes to existing endpoints
   - Significant restructuring of resources
   - Changes in authentication mechanism
   - Major version changes are exposed in the URL path

2. **Minor Version Changes** (v1.0 → v1.1):
   - Non-breaking additions to existing resources
   - New optional parameters
   - New endpoints that don't affect existing functionality
   - Minor version changes can be requested via header or query string

#### Creating a New API Version

To create a new version of an endpoint:

1. Create a new controller in a version-specific folder (e.g., `Controllers/V2/UsersController.cs`)
2. Apply the `[ApiVersion("2.0")]` attribute to the controller
3. Ensure the route template includes the version: `[Route("api/v{version:apiVersion}/[controller]")]`
4. Implement the new version's functionality

#### Deprecating API Versions

To mark an API version as deprecated:
1. Add the `Deprecated = true` parameter to the ApiVersion attribute:
   ```csharp
   [ApiVersion("1.0", Deprecated = true)]
   ```
2. The Swagger UI will automatically show a deprecation notice for this version

All clients should be encouraged to migrate to the latest non-deprecated version.

## ArcanaVerse-Specific API Endpoints

### Card Endpoints

#### Get All Cards

```bash
GET /api/v1/cards
```

Retrieves all available tarot cards.

#### Get Card by ID

```bash
GET /api/v1/cards/{id}
```

Retrieves a specific tarot card by ID.

#### Get Random Card

```bash
GET /api/v1/cards/random
```

Retrieves a random tarot card for readings.

#### Example Card Request

```bash
curl -v -X GET "http://localhost:5000/api/v1/cards/random" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Fortune Endpoints

#### Get Daily Fortune

```bash
GET /api/v1/fortunes/daily
```

Retrieves the daily fortune content.

#### Get Fortune by Theme

```bash
GET /api/v1/fortunes/theme/{themeId}
```

Retrieves fortune content for a specific theme.

#### Example Fortune Request

```bash
curl -v -X GET "http://localhost:5000/api/v1/fortunes/daily" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Theme Endpoints

#### Get All Themes

```bash
GET /api/v1/themes
```

Retrieves all available reading themes.

#### Get Theme by ID

```bash
GET /api/v1/themes/{id}
```

Retrieves a specific theme by ID.

#### Example Theme Request

```bash
curl -v -X GET "http://localhost:5000/api/v1/themes" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### User Endpoints

#### Get All Users

```bash
curl -v -X GET "http://localhost:5000/api/v1/users" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get User by ID

```bash
curl -v -X GET "http://localhost:5000/api/v1/users/3fa85f64-5717-4562-b3fc-2c963f66afa6" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create User

```bash
curl -v -X POST "http://localhost:5000/api/v1/users" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "preferences": {
      "favoriteThemeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  }'
```

#### Update User

```bash
curl -v -X PUT "http://localhost:5000/api/v1/users/3fa85f64-5717-4562-b3fc-2c963f66afa6" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe_updated",
    "email": "john.updated@example.com",
    "preferences": {
      "favoriteThemeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  }'
```

#### Delete User

```bash
curl -v -X DELETE "http://localhost:5000/api/v1/users/3fa85f64-5717-4562-b3fc-2c963f66afa6" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Health Check

```bash
curl -v -X GET "http://localhost:5000/healthz"
```

## Database

The application is configured to use:
- SQL Server in production (configure connection string in appsettings.json)
- In-memory database for development (no setup required)

The database structure includes tables for:
- Users
- Cards
- Fortunes
- Daily Fortunes
- Themes

## Database Migrations

The initial database migration has been set up and will create all required tables when the application runs in Production mode. To update the database structure:

1. Make changes to your entity models
2. Create a new migration:
```bash
dotnet ef migrations add YourMigrationName
```
3. Update the database:
```bash
dotnet ef database update
```

## Running Tests

To run the unit tests:

```bash
cd backend/Api.Tests
dotnet test
```

The test project includes tests for:
- Card service
- Theme service
- User service
- Business logic
- Input validation 

## Project Architecture

The project follows a clean architecture with several layers:

1. **Controllers** - Handle HTTP requests and responses
2. **Services** - Implement business logic and validate input
3. **Repositories** - Provide data access abstraction
4. **Models** - Define domain entities, DTOs, and request/response models
5. **Middleware** - Implement cross-cutting concerns like error handling

This separation of concerns makes the codebase more maintainable and testable.

## 🔗 Related Documentation

- [Backend Documentation](../README.md) - General backend information
- [Main Project Documentation](../../README.md) - Overall project documentation
- [Kubernetes Deployment](../../kubernetes/README.md) - Deployment configuration