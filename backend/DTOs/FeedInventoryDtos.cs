using System.ComponentModel.DataAnnotations;

namespace NaffBrightFarm.Api.DTOs;

public class CreateFeedDto
{
    [Required(ErrorMessage = "Feed name is required (e.g., Silage, Dairy Meal, Hay).")]
    public string FeedName { get; set; } = string.Empty;

    [Range(0, 100000, ErrorMessage = "Quantity must be non-negative.")]
    public decimal QuantityKg { get; set; }

    [Range(0.01, 10000, ErrorMessage = "Cost per Kg must be greater than zero.")]
    public decimal CostPerKg { get; set; }

    [Range(1, 10000, ErrorMessage = "Reorder threshold must be at least 1 Kg.")]
    public decimal ReorderThresholdKg { get; set; } = 100;
}

public class AdjustFeedStockDto
{
    // Positive to add stock (restock), negative to deduct stock (used during feeding)
    [Required]
    public decimal ChangeInKg { get; set; }

    public string? Reason { get; set; } // e.g., "Morning Feeding Shift", "Delivered 20 Bags"
}