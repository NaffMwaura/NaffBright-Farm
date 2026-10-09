using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class CreateHealthRecordDto
{
    [Required]
    public Guid CowId { get; set; }

    [Required(ErrorMessage = "Diagnosis is required (e.g., Early Mastitis, Routine Tick Spray).")]
    public string Diagnosis { get; set; } = string.Empty;

    [Required(ErrorMessage = "Treatment details are required.")]
    public string Treatment { get; set; } = string.Empty;

    [Required(ErrorMessage = "Veterinarian or attendant name is required.")]
    public string VetName { get; set; } = string.Empty;

    [Range(0, 500000, ErrorMessage = "Cost cannot be negative.")]
    public decimal TreatmentCost { get; set; }

    public DateTime? Date { get; set; }
}

public class HealthRecordResponseDto
{
    public Guid Id { get; set; }
    public Guid CowId { get; set; }
    public string CowTag { get; set; } = string.Empty;
    public string CowName { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string VetName { get; set; } = string.Empty;
    public decimal TreatmentCost { get; set; }
    public DateTime Date { get; set; }
}