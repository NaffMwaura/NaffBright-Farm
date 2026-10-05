namespace NaffBrightFarm.Api.Entities;

public class WorkSchedule
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime ShiftDate { get; set; }
    public string ShiftName { get; set; } = "Morning"; // Morning (5AM-1PM), Evening (1PM-9PM)
    public string AssignedDuty { get; set; } = "Milking & Sanitization";
}