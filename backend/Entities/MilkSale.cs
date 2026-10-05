namespace NaffBrightFarm.Api.Entities;

public class MilkSale
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string CustomerName { get; set; } = string.Empty;
    public decimal LitresSold { get; set; }
    public decimal PricePerLitre { get; set; }
    public decimal TotalAmount => LitresSold * PricePerLitre;
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
}