namespace NaffBrightFarm.Api.Entities;

public class Timesheet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime WorkDate { get; set; } = DateTime.UtcNow.Date;
    public decimal HoursWorked { get; set; }
    public string TasksCompleted { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public decimal? ApprovedPaymentAmount { get; set; }
}