namespace NaffBrightFarm.Api.Entities;

public class Cow
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TagNumber { get; set; } = string.Empty; // e.g., "NB001"
    public string Name { get; set; } = string.Empty;      // e.g., "Bella"
    public string Breed { get; set; } = string.Empty;     // e.g., "Holstein-Friesian"
    public string Gender { get; set; } = "Female";
    public DateTime? DateOfBirth { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Status { get; set; } = "Healthy";       // Healthy, Sick, Pregnant, Dry, Sold, Deceased

    // Relationships
    public ICollection<MilkRecord> MilkRecords { get; set; } = new List<MilkRecord>();
    public ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();
    public CowSale? CowSale { get; set; }
}