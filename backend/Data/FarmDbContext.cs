using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class FarmDbContext(DbContextOptions<FarmDbContext> options) : DbContext(options)
{
    public DbSet<Cow> Cows => Set<Cow>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cow>()
            .HasIndex(cow => cow.TagNumber)
            .IsUnique();
    }
}
