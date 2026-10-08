using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Context
builder.Services.AddDbContext<NaffBrightDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Run Seeder on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<NaffBrightDbContext>();
        await DbSeeder.SeedAsync(context);
        Console.WriteLine("[INFO] Database seeded successfully: Roles and Admin ready.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Error occurred during DB seeding: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();