using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Api.Data;
using Microsoft.AspNetCore.Authorization;
using Api.Middleware;
using Api.Repositories;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;
using Api.Services.Implementations;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.AspNetCore.Mvc;
using Api.Infrastructure;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Authorization services but don't set a fallback policy
builder.Services.AddAuthorization();

// Configure API Versioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version"),
        new QueryStringApiVersionReader("api-version")
    );
});

// Configure API Version Explorer
builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// Register Swagger configuration options (must be done BEFORE AddSwaggerGen)
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>>(serviceProvider =>
{
    var apiVersionDescriptionProvider = serviceProvider
        .GetRequiredService<IApiVersionDescriptionProvider>();
    
    return new ConfigureSwaggerOptions(apiVersionDescriptionProvider);
});

// Configure Swagger with JWT support and versioning
builder.Services.AddSwaggerGen(c =>
{
    // Add servers to ensure proper URL resolution - only use HTTP in development
    c.AddServer(new OpenApiServer { Url = "http://localhost:5000" });
    
    // Only add HTTPS server in production
    if (!builder.Environment.IsDevelopment())
    {
        c.AddServer(new OpenApiServer { Url = "https://localhost:5001" });
    }

    // Configure JWT authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Apply the versioning configuration to Swagger
    c.OperationFilter<SwaggerDefaultValues>();
});

// Configure SQL Server with Entity Framework Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("InMemoryDb"));

// Register repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register services
builder.Services.AddScoped<IUserService, UserService>();

// Configure JWT Authentication
builder.Services.AddAuthentication(options => 
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Don't authenticate requests to Swagger endpoints
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Path.StartsWithSegments("/swagger"))
            {
                context.Token = null;
                return Task.CompletedTask;
            }
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            // Skip challenge for Swagger requests
            if (context.Request.Path.StartsWithSegments("/swagger"))
            {
                context.HandleResponse();
                return Task.CompletedTask;
            }
            return Task.CompletedTask;
        }
    };
    
    // Enable Swagger token passing
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // Allow testing without HTTPS
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "your-issuer",
        ValidAudience = builder.Configuration["JwtSettings:Audience"] ?? "your-audience",
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"] ?? "your-secret-key-here-must-be-at-least-32-chars"))
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Make Swagger available only in development environment
    app.UseSwagger(c => 
    {
        c.SerializeAsV2 = false;
    });
    
    app.UseSwaggerUI(options => 
    {
        // Get API version provider from service provider
        var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
        
        // Build a swagger endpoint for each API version
        foreach (var description in provider.ApiVersionDescriptions)
        {
            options.SwaggerEndpoint(
                $"/swagger/{description.GroupName}/swagger.json", 
                $"API {description.GroupName.ToUpperInvariant()}");
        }
        
        // Configure Swagger UI options
        options.RoutePrefix = "swagger";
        options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
        options.DefaultModelsExpandDepth(-1); // Hide models
        options.EnableTryItOutByDefault();
        options.EnableDeepLinking();
        options.DisplayRequestDuration();
    });
}
else
{
    // In production, use a global exception handler
    app.UseExceptionHandler("/error");
}

// Add global exception handling middleware
app.UseGlobalExceptionMiddleware();

// IMPORTANT: Use AllowAll CORS policy instead of AllowFrontend
app.UseCors("AllowAll");

// Only use HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Order matters for authentication/authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and migrations are applied
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
    DbInitialiser.InitialiseData(db); // Database initialisation
}

app.Run(); 