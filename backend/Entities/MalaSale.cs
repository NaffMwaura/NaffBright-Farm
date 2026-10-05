namespace NaffBrightFarm.Api.Entities;

public class MalaProduction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public decimal MilkUsedLitres { get; set; }
    public decimal MalaProducedLitres { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
}

public class MalaSale
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string CustomerName { get; set; } = string.Empty;
    public decimal QuantityLitres { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalAmount => QuantityLitres * UnitPrice;
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
}