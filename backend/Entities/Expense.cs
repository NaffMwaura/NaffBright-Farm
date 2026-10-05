namespace NaffBrightFarm.Api.Entities;

public class Expense
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Category { get; set; } = string.Empty; // Feed, Veterinary, Labor, Fuel, Utilities
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
}