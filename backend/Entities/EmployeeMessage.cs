namespace NaffBrightFarm.Api.Entities;

public class EmployeeMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;

    // Type determines whether it's an inquiry, a field incident report, or an instruction from admin
    public string MessageType { get; set; } = "Report"; // "Report", "Inquiry", "Instruction"
    
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}