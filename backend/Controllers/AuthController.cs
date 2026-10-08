using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.DTOs;
using NaffBrightFarm.Api.Entities;
using NaffBrightFarm.Api.Services;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly NaffBrightDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(NaffBrightDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        var normalizedEmail = request.Email.Trim().ToLower();

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !user.IsActive)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = _tokenService.CreateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.Name,
            MustChangePassword = user.MustChangePassword,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("register-employee")]
    public async Task<IActionResult> RegisterEmployee([FromBody] RegisterEmployeeDto request)
    {
        var rawName = request.FullName.Trim();
        var nameParts = rawName.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        if (nameParts.Length < 2)
        {
            return BadRequest(new { message = "Please provide both first and last name (e.g., 'Peter Kamau')." });
        }

        var firstName = nameParts[0].ToLower();
        var lastName = nameParts[^1].ToLower();
        var generatedEmail = $"{firstName}.{lastName}@naffbright.com";

        var existingUser = await _context.Users.AnyAsync(u => u.Email == generatedEmail);
        if (existingUser)
        {
            // If duplicate exists, append a random 2-digit tag
            generatedEmail = $"{firstName}.{lastName}{Random.Shared.Next(10, 99)}@naffbright.com";
        }

        var employeeRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Employee");
        if (employeeRole == null)
        {
            return StatusCode(500, new { message = "Employee role missing from database." });
        }

        var tempPassword = string.IsNullOrWhiteSpace(request.InitialPassword) 
            ? "NaffBright#2026" 
            : request.InitialPassword;

        var newEmployee = new User
        {
            Id = Guid.NewGuid(),
            FullName = rawName,
            Email = generatedEmail,
            PhoneNumber = request.PhoneNumber.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword),
            RoleId = employeeRole.Id,
            IsActive = true,
            MustChangePassword = true, // Forces prompt on frontend
            CreatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(newEmployee);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Employee created successfully.",
            userId = newEmployee.Id,
            fullName = newEmployee.FullName,
            generatedEmail = newEmployee.Email,
            temporaryPassword = tempPassword,
            mustChangePassword = true,
            resetUrl = $"http://localhost:5173/dashboard/reset?password=true&userId={newEmployee.Id}"
        });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null) return NotFound(new { message = "User not found." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.MustChangePassword = false;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Password updated successfully. You can now use the dashboard." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == userEmail);

        if (user == null) return NotFound();

        return Ok(new
        {
            userId = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role.Name,
            mustChangePassword = user.MustChangePassword
        });
    }
}