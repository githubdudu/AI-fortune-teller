using Api.Data;
using Api.Models.Domain;
using Api.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Api.Tests.Repositories
{
    public class CardRepositoryTests
    {
        /// <summary>
        /// Fresh in-memory context per test so seeded cards don't leak between them.
        /// </summary>
        private static ApplicationDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        private static Card MakeCard(string name, int number) =>
            new Card
            {
                Id = Guid.NewGuid(),
                Name = name,
                Number = number,
                ImageSource = $"{name}.jpg",
                Description = name,
                IsMajorArcana = true,
                CreatedAt = DateTime.UtcNow
            };

        [Fact]
        public async Task GetCardsByIdsAsync_ReturnsCardsInTheOrderTheIdsWereGiven()
        {
            using var context = CreateContext();
            var repository = new CardRepository(context);

            var fool = MakeCard("The Fool", 0);
            var magician = MakeCard("The Magician", 1);
            var priestess = MakeCard("The High Priestess", 2);

            context.Cards.AddRange(fool, magician, priestess);
            await context.SaveChangesAsync();

            // Deliberately not the insertion order - a spread's card positions are
            // meaningful, so the caller's order is what must come back.
            var ids = new[] { priestess.Id, fool.Id, magician.Id };

            var result = (await repository.GetCardsByIdsAsync(ids)).ToList();

            Assert.Equal(
                new[] { "The High Priestess", "The Fool", "The Magician" },
                result.Select(card => card.Name)
            );
        }

        [Fact]
        public async Task GetCardsByIdsAsync_SkipsIdsWithNoMatchingCard()
        {
            using var context = CreateContext();
            var repository = new CardRepository(context);

            var fool = MakeCard("The Fool", 0);
            context.Cards.Add(fool);
            await context.SaveChangesAsync();

            var ids = new[] { Guid.NewGuid(), fool.Id, Guid.NewGuid() };

            var result = (await repository.GetCardsByIdsAsync(ids)).ToList();

            Assert.Single(result);
            Assert.Equal("The Fool", result[0].Name);
        }

        [Fact]
        public async Task GetCardsByIdsAsync_ReturnsEmptyWhenNoIdsGiven()
        {
            using var context = CreateContext();
            var repository = new CardRepository(context);

            context.Cards.Add(MakeCard("The Fool", 0));
            await context.SaveChangesAsync();

            var result = await repository.GetCardsByIdsAsync(Array.Empty<Guid>());

            Assert.Empty(result);
        }
    }
}
