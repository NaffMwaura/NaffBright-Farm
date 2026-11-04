using System.Diagnostics;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.Services;

// 1. Load local .env file variables if present (ignored in production)
var builder = WebApplication.CreateBuilder(args);

// 2. Add Controllers
builder.Services.AddControllers();

// 3. Register Database Context with Fallback
// Supports both 'ConnectionStrings__DefaultConnection' and plain 'DefaultConnection'
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                    ?? builder.Configuration["DefaultConnection"]
                    ?? throw new InvalidOperationException("Database connection string is missing.");

builder.Services.AddDbContext<NaffBrightDbContext>(options =>
    options.UseNpgsql(connectionString));

// 4. Register Application Services
builder.Services.AddScoped<ITokenService, TokenService>();

// 5. Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? builder.Configuration["Jwt__Key"]
    ?? throw new InvalidOperationException("JWT Key is missing.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? builder.Configuration["Jwt__Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? builder.Configuration["Jwt__Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 6. CORS Policy (Local + Production Origins)
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:5173", 
                  "https://localhost:5173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 7. Swagger Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "NaffBright Farm API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Type 'Bearer' [space] and your token."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// -------------------------------------------------------------------
// CUSTOM COLORED HTTP REQUEST LOGGER
// -------------------------------------------------------------------
app.Use(async (context, next) =>
{
    var timer = Stopwatch.StartNew();
    
    await next();
    
    timer.Stop();

    var statusCode = context.Response.StatusCode;
    var method = context.Request.Method;
    var path = context.Request.Path;
    var elapsedMs = timer.ElapsedMilliseconds;

    ConsoleColor statusColor = statusCode switch
    {
        >= 200 and < 300 => ConsoleColor.Cyan,
        >= 300 and < 400 => ConsoleColor.DarkCyan,
        >= 400 and < 500 => ConsoleColor.Yellow,
        _ => ConsoleColor.Red
    };

    Console.ForegroundColor = statusColor;
    Console.Write($"[{statusCode}] ");
    Console.ResetColor();

    Console.ForegroundColor = ConsoleColor.White;
    Console.Write($"{method.PadRight(6)} ");
    Console.ResetColor();

    Console.ForegroundColor = ConsoleColor.Gray;
    Console.Write($"{path} ");
    
    Console.ForegroundColor = ConsoleColor.DarkGray;
    Console.WriteLine($"({elapsedMs}ms)");
    Console.ResetColor();
});
// -------------------------------------------------------------------

// Run Database Seeder
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<NaffBrightDbContext>();
        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] DB Seeding failed: {ex.Message}");
    }
}

// Enable Swagger in both Development and Production for testing Render endpoints
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "NaffBright Farm API v1");
    c.RoutePrefix = string.Empty;
});

app.UseCors("ReactPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();