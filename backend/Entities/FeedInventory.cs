namespace NaffBrightFarm.Api.Entities;

public class FeedInventory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FeedName { get; set; } = string.Empty; // Hay, Silage, Dairy Meal
    public decimal QuantityKg { get; set; }
    public decimal CostPerKg { get; set; }
    public decimal ReorderThresholdKg { get; set; } = 100; // Trigger Low Feed alert
}

