using System.Diagnostics;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers
builder.Services.AddControllers();

// 2. Register Database Context
builder.Services.AddDbContext<NaffBrightDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Register Application Services
builder.Services.AddScoped<ITokenService, TokenService>();

// 4. Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? throw new InvalidOperationException("JWT Key is missing in appsettings.json");

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
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();


//Add Cors policy to allow requests from the frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 5. Swagger Setup
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
    
    // Let the request proceed to the controller
    await next();
    
    timer.Stop();

    var statusCode = context.Response.StatusCode;
    var method = context.Request.Method;
    var path = context.Request.Path;
    var elapsedMs = timer.ElapsedMilliseconds;

    // Pick color based on status code
    ConsoleColor statusColor = statusCode switch
    {
        >= 200 and < 300 => ConsoleColor.Cyan,      // 2xx Success (Blue/Cyan)
        >= 300 and < 400 => ConsoleColor.DarkCyan,  // 3xx Redirects
        >= 400 and < 500 => ConsoleColor.Yellow,    // 4xx Client Errors
        _ => ConsoleColor.Red                       // 5xx Server Errors
    };

    // Print to console: [200 OK] POST /api/Auth/login (28ms)
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

// Run Seeder on Startup
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Only enforce HTTPS redirect in production (removes the local dev warning)
    app.UseHttpsRedirection();
}

app.UseCors("ReactPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();