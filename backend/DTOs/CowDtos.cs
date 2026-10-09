using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class CreateCowDto
{
    [Required]
    public string TagNumber { get; set; } = string.Empty; // e.g. "NB001"
    public string Name { get; set; } = string.Empty;
    [Required]
    public string Breed { get; set; } = string.Empty;
    public string Gender { get; set; } = "Female";
    public DateTime? DateOfBirth { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Status { get; set; } = "Healthy";
}

public class UpdateCowDto
{
    public string? Name { get; set; }
    public string? Breed { get; set; }
    public string? Status { get; set; }
    public decimal? PurchasePrice { get; set; }
}