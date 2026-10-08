using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.DTOs;
using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CowsController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public CowsController(NaffBrightDbContext context)
    {
        _context = context;
    }

    // Both Admin and Employees can list and inspect cows
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllCows([FromQuery] string? status)
    {
        var query = _context.Cows.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(c => c.Status.ToLower() == status.ToLower());
        }

        var cows = await query
            .Select(c => new
            {
                c.Id,
                c.TagNumber,
                c.Name,
                c.Breed,
                c.Gender,
                c.Status,
                c.DateOfBirth,
                c.PurchasePrice,
                TotalMilkRecorded = c.MilkRecords.Sum(m => m.QuantityLitres),
                LatestHealthCheck = c.HealthRecords.OrderByDescending(h => h.Date).Select(h => h.Diagnosis).FirstOrDefault()
            })
            .ToListAsync();

        return Ok(cows);
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCowById(Guid id)
    {
        var cow = await _context.Cows
            .Include(c => c.MilkRecords.OrderByDescending(m => m.Date).Take(30))
            .Include(c => c.HealthRecords.OrderByDescending(h => h.Date))
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cow == null) return NotFound(new { message = $"Cow with ID {id} not found." });

        return Ok(cow);
    }

    // Admin only can register new cows
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCow([FromBody] CreateCowDto dto)
    {
        var tagExists = await _context.Cows.AnyAsync(c => c.TagNumber.ToUpper() == dto.TagNumber.ToUpper());
        if (tagExists) return BadRequest(new { message = $"Tag number {dto.TagNumber} already exists." });

        var cow = new Cow
        {
            Id = Guid.NewGuid(),
            TagNumber = dto.TagNumber.Trim().ToUpper(),
            Name = dto.Name.Trim(),
            Breed = dto.Breed.Trim(),
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth,
            PurchasePrice = dto.PurchasePrice,
            Status = dto.Status
        };

        await _context.Cows.AddAsync(cow);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCowById), new { id = cow.Id }, cow);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCow(Guid id, [FromBody] UpdateCowDto dto)
    {
        var cow = await _context.Cows.FindAsync(id);
        if (cow == null) return NotFound();

        if (dto.Name != null) cow.Name = dto.Name.Trim();
        if (dto.Breed != null) cow.Breed = dto.Breed.Trim();
        if (dto.Status != null) cow.Status = dto.Status.Trim();
        if (dto.PurchasePrice.HasValue) cow.PurchasePrice = dto.PurchasePrice.Value;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cow updated successfully.", cow });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCow(Guid id)
    {
        var cow = await _context.Cows.FindAsync(id);
        if (cow == null) return NotFound();

        _context.Cows.Remove(cow);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Cow {cow.TagNumber} deleted." });
    }
}