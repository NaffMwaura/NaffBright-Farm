namespace NaffBrightFarm.Api.Entities;

public class CowSale
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CowId { get; set; }
    public Cow Cow { get; set; } = null!;

    public string BuyerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
}