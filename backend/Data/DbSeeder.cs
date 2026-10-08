using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(NaffBrightDbContext context)
    {
        // 1. Ensure the database schema is up to date
        await context.Database.MigrateAsync();

        // 2. Seed Default Roles if they do not exist
        var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
        if (adminRole == null)
        {
            adminRole = new Role
            {
                Id = Guid.NewGuid(),
                Name = "Admin"
            };
            await context.Roles.AddAsync(adminRole);
        }

        var employeeRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Employee");
        if (employeeRole == null)
        {
            employeeRole = new Role
            {
                Id = Guid.NewGuid(),
                Name = "Employee"
            };
            await context.Roles.AddAsync(employeeRole);
        }

        await context.SaveChangesAsync();

        // 3. Seed Root Admin User
        var adminEmail = "admin@naffbright.com";
        var existingAdmin = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);

        if (existingAdmin == null)
        {
            var rootAdmin = new User
            {
                Id = Guid.NewGuid(),
                FullName = "NaffBright Farm Owner",
                Email = adminEmail,
                // Securely hash default initial password
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345"),
                PhoneNumber = "+254700000000",
                IsActive = true,
                RoleId = adminRole.Id,
                CreatedAt = DateTime.UtcNow
            };

            await context.Users.AddAsync(rootAdmin);
            await context.SaveChangesAsync();
        }
    }
}