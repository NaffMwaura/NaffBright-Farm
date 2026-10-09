using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class CreateExpenseDto
{
    [Required(ErrorMessage = "Category is required (e.g., Veterinary, Feed, Labor, Fuel, Utilities).")]
    public string Category { get; set; } = string.Empty;

    [Range(1, 10000000, ErrorMessage = "Amount must be greater than zero.")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Description is required.")]
    public string Description { get; set; } = string.Empty;

    public DateTime? Date { get; set; }
}

public class UpdateExpenseDto
{
    public string? Category { get; set; }
    public decimal? Amount { get; set; }
    public string? Description { get; set; }
    public DateTime? Date { get; set; }
}