namespace NaffBrightFarm.Api.Entities;

public class HealthRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CowId { get; set; }
    public Cow Cow { get; set; } = null!;

    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string VetName { get; set; } = string.Empty;
    public decimal TreatmentCost { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
}