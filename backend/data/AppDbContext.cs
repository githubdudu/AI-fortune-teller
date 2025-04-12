using Microsoft.EntityFrameworkCore;
using ArcanaVerse.models;

namespace ArcanaVerse.data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Theme> Themes { get; set; }
        public DbSet<Card> Cards { get; set; }
    }
}