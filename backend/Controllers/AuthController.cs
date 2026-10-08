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

    /// <summary>
    /// Authenticate user and issue JWT token
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        var normalizedEmail = request.Email.Trim().ToLower();

        // Query user with their assigned Role
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !user.IsActive)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        // Verify BCrypt password hash
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        // Generate JWT token containing identity claims and role
        var token = _tokenService.CreateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.Name,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        });
    }

    /// <summary>
    /// Admin only: Register a new farm employee with format firstname.lastname@naffbright.com
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("register-employee")]
    public async Task<IActionResult> RegisterEmployee([FromBody] RegisterEmployeeDto request)
    {
        // Enforce employee email standard: firstname.lastname@naffbright.com
        var cleanFirst = request.FirstName.Trim().ToLower();
        var cleanLast = request.LastName.Trim().ToLower();
        var generatedEmail = $"{cleanFirst}.{cleanLast}@naffbright.com";

        // Check if employee already exists
        var existingUser = await _context.Users.AnyAsync(u => u.Email == generatedEmail);
        if (existingUser)
        {
            return BadRequest(new { message = $"An employee with email {generatedEmail} already exists." });
        }

        // Fetch Employee Role
        var employeeRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Employee");
        if (employeeRole == null)
        {
            return StatusCode(500, new { message = "Employee role not configured in database." });
        }

        var newEmployee = new User
        {
            Id = Guid.NewGuid(),
            FullName = $"{request.FirstName.Trim()} {request.LastName.Trim()}",
            Email = generatedEmail,
            PhoneNumber = request.PhoneNumber.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = employeeRole.Id,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(newEmployee);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Employee registered successfully.",
            employeeId = newEmployee.Id,
            email = newEmployee.Email,
            fullName = newEmployee.FullName,
            role = "Employee"
        });
    }

    /// <summary>
    /// Retrieve the currently authenticated user's profile
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(userEmail))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == userEmail);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(new
        {
            userId = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role.Name,
            phoneNumber = user.PhoneNumber
        });
    }
}
