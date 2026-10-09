using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.DTOs;
using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HealthRecordsController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public HealthRecordsController(NaffBrightDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllHealthRecords()
    {
        var records = await _context.HealthRecords
            .Include(h => h.Cow)
            .OrderByDescending(h => h.Date)
            .Select(h => new HealthRecordResponseDto
            {
                Id = h.Id,
                CowId = h.CowId,
                CowTag = h.Cow.TagNumber,
                CowName = h.Cow.Name,
                Diagnosis = h.Diagnosis,
                Treatment = h.Treatment,
                VetName = h.VetName,
                TreatmentCost = h.TreatmentCost,
                Date = h.Date
            })
            .ToListAsync();

        return Ok(records);
    }

    [HttpGet("cow/{cowId:guid}")]
    public async Task<IActionResult> GetHealthRecordsByCow(Guid cowId)
    {
        var cowExists = await _context.Cows.AnyAsync(c => c.Id == cowId);
        if (!cowExists) return NotFound(new { message = "Cow not found." });

        var records = await _context.HealthRecords
            .Where(h => h.CowId == cowId)
            .OrderByDescending(h => h.Date)
            .Select(h => new HealthRecordResponseDto
            {
                Id = h.Id,
                CowId = h.CowId,
                CowTag = h.Cow.TagNumber,
                CowName = h.Cow.Name,
                Diagnosis = h.Diagnosis,
                Treatment = h.Treatment,
                VetName = h.VetName,
                TreatmentCost = h.TreatmentCost,
                Date = h.Date
            })
            .ToListAsync();

        return Ok(records);
    }

    [HttpPost]
    public async Task<IActionResult> RecordTreatment([FromBody] CreateHealthRecordDto dto)
    {
        var cow = await _context.Cows.FindAsync(dto.CowId);
        if (cow == null) return NotFound(new { message = "Cow not found." });

        var record = new HealthRecord
        {
            Id = Guid.NewGuid(),
            CowId = dto.CowId,
            Diagnosis = dto.Diagnosis.Trim(),
            Treatment = dto.Treatment.Trim(),
            VetName = dto.VetName.Trim(),
            TreatmentCost = dto.TreatmentCost,
            Date = dto.Date ?? DateTime.UtcNow
        };

        // If the diagnosis implies illness, keep cow status updated
        if (cow.Status == "Healthy" && dto.Diagnosis.Contains("Sick", StringComparison.OrdinalIgnoreCase))
        {
            cow.Status = "Sick";
        }

        await _context.HealthRecords.AddAsync(record);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Treatment recorded for cow {cow.TagNumber}.",
            recordId = record.Id,
            cost = record.TreatmentCost
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteHealthRecord(Guid id)
    {
        var record = await _context.HealthRecords.FindAsync(id);
        if (record == null) return NotFound();

        _context.HealthRecords.Remove(record);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Health record deleted." });
    }
}