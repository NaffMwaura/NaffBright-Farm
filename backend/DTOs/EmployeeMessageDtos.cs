using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class CreateMessageDto
{
    [Required]
    [RegularExpression("^(Report|Inquiry|Instruction)$", ErrorMessage = "MessageType must be 'Report', 'Inquiry', or 'Instruction'.")]
    public string MessageType { get; set; } = "Report";

    [Required(ErrorMessage = "Subject is required.")]
    [MaxLength(150)]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Message content cannot be empty.")]
    public string Content { get; set; } = string.Empty;
}

public class MessageResponseDto
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
    public string MessageType { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}