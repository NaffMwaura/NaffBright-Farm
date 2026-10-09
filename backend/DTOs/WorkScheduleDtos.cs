using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class CreateWorkScheduleDto
{
    [Required(ErrorMessage = "Employee ID is required.")]
    public Guid UserId { get; set; }

    [Required]
    public DateTime ShiftDate { get; set; }

    [Required]
    [RegularExpression("^(Morning|Evening|Full-Day)$", ErrorMessage = "ShiftName must be 'Morning', 'Evening', or 'Full-Day'.")]
    public string ShiftName { get; set; } = "Morning";

    [Required]
    public string AssignedDuty { get; set; } = "Milking & Sanitization";
}

public class WorkScheduleResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;
    public DateTime ShiftDate { get; set; }
    public string ShiftName { get; set; } = string.Empty;
    public string AssignedDuty { get; set; } = string.Empty;
}