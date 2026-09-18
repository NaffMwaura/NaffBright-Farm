namespace backend.Models;

public class Cow
{
    public int Id { get; set; }
    public required string TagNumber { get; set; }
    public required string Breed { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? Sex { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
