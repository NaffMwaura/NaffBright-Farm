using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class SubmitTimesheetDto
{
    public DateTime? WorkDate { get; set; }

    [Range(0.5, 24, ErrorMessage = "Hours worked must be between 0.5 and 24 hours.")]
    public decimal HoursWorked { get; set; }

    [Required(ErrorMessage = "Please list the tasks you completed.")]
    public string TasksCompleted { get; set; } = string.Empty;
}

public class ReviewTimesheetDto
{
    [Required]
    [RegularExpression("^(Approved|Rejected)$", ErrorMessage = "Status must be 'Approved' or 'Rejected'.")]
    public string Status { get; set; } = "Approved";

    [Range(0, 100000, ErrorMessage = "Payment amount cannot be negative.")]
    public decimal? ApprovedPaymentAmount { get; set; }
}

public class TimesheetResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateTime WorkDate { get; set; }
    public decimal HoursWorked { get; set; }
    public string TasksCompleted { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "Pending", "Approved", "Rejected"
    public decimal? ApprovedPaymentAmount { get; set; }
}