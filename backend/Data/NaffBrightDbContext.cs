using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Data;

public class NaffBrightDbContext : DbContext
{
    public NaffBrightDbContext(DbContextOptions<NaffBrightDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Cow> Cows => Set<Cow>();
    public DbSet<MilkRecord> MilkRecords => Set<MilkRecord>();
    public DbSet<HealthRecord> HealthRecords => Set<HealthRecord>();
    public DbSet<MilkSale> MilkSales => Set<MilkSale>();
    public DbSet<MalaProduction> MalaProductions => Set<MalaProduction>();
    public DbSet<MalaSale> MalaSales => Set<MalaSale>();
    public DbSet<CowSale> CowSales => Set<CowSale>();
    public DbSet<FeedInventory> FeedInventories => Set<FeedInventory>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<WorkSchedule> WorkSchedules => Set<WorkSchedule>();
    public DbSet<Timesheet> Timesheets => Set<Timesheet>();
    public DbSet<EmployeeMessage> EmployeeMessages => Set<EmployeeMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Enforce unique tags and emails
        modelBuilder.Entity<Cow>()
            .HasIndex(c => c.TagNumber)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // High precision for currency & milk liters
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }

        // 1-to-1 Cow to CowSale relationship
        modelBuilder.Entity<Cow>()
            .HasOne(c => c.CowSale)
            .WithOne(cs => cs.Cow)
            .HasForeignKey<CowSale>(cs => cs.CowId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
