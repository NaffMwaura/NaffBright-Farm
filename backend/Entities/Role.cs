namespace NaffBrightFarm.Api.Entities;

public class Role
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty; // "Admin", "Manager", "Employee"

    // Navigation property
    public ICollection<User> Users { get; set; } = new List<User>();
}