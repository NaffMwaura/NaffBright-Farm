using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool MustChangePassword { get; set; } // <--- Frontend reads this to redirect to /dashboard/reset?password=...
    public DateTime ExpiresAt { get; set; }
}

public class RegisterEmployeeDto
{
    [Required]
    public string FullName { get; set; } = string.Empty; // e.g. "Peter Kamau"

    [Phone]
    public string PhoneNumber { get; set; } = string.Empty;

    // Optional override; if empty, system generates default: "NaffBright#2026"
    public string? InitialPassword { get; set; } 
}

public class ChangePasswordDto
{
    [Required]
    [MinLength(6, ErrorMessage = "New password must be at least 6 characters long.")]
    public string NewPassword { get; set; } = string.Empty;
}