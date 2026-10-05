namespace NaffBrightFarm.Api.Entities;

public class MilkRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CowId { get; set; }
    public Cow Cow { get; set; } = null!;

    public decimal QuantityLitres { get; set; }
    public string Shift { get; set; } = "Morning"; // Morning, Noon, Evening
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;

    // Who logged this record (Worker ID)
    public Guid RecordedByUserId { get; set; }
    public User RecordedByUser { get; set; } = null!;
}