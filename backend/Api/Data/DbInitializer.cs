using Api.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public static class DbInitializer
    {
        //Initialize testuser's id as Guid
        public static readonly Guid TestUserId = new("11111111-1111-1111-1111-111111111111");

        public static void InitializeData(ApplicationDbContext context)
        {
            // The rows themselves live in SeedData
            if (!context.Themes.Any())
            {
                context.Themes.AddRange(SeedData.CreateThemes());
            }

            if (!context.Cards.Any())
            {
                context.Cards.AddRange(SeedData.CreateMajorArcana());
                context.Cards.AddRange(SeedData.CreateCups());
                context.Cards.AddRange(SeedData.CreatePentacles());
                context.Cards.AddRange(SeedData.CreateSwords());
                context.Cards.AddRange(SeedData.CreateWands());
            }

            //Initialize test user
            if (!context.Users.Any(u => u.Id == TestUserId))
            {
                context.Users.Add(new User
                {
                    Id = TestUserId,
                    Email = "test@example.com",
                    DisplayName = "testuser",
                    CreatedAt = DateTime.UtcNow,
                });
            }

            context.SaveChanges();
        }
    }
}
