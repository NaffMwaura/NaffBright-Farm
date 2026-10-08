using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductionController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public ProductionController(NaffBrightDbContext context)
    {
        _context = context;
    }

    // Workers log milk records
    [Authorize]
    [HttpPost("milk-record")]
    public async Task<IActionResult> LogMilk([FromBody] LogMilkDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var cowExists = await _context.Cows.AnyAsync(c => c.Id == dto.CowId);
        if (!cowExists) return NotFound(new { message = "Cow not found." });

        var record = new MilkRecord
        {
            Id = Guid.NewGuid(),
            CowId = dto.CowId,
            QuantityLitres = dto.QuantityLitres,
            Shift = dto.Shift,
            Date = dto.Date ?? DateTime.UtcNow.Date,
            RecordedByUserId = userId
        };

        await _context.MilkRecords.AddAsync(record);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Milk logged successfully.", recordId = record.Id });
    }

    // Log milk sales
    [Authorize(Roles = "Admin")]
    [HttpPost("milk-sale")]
    public async Task<IActionResult> RecordMilkSale([FromBody] MilkSale sale)
    {
        sale.Id = Guid.NewGuid();
        sale.SaleDate = DateTime.UtcNow;

        await _context.MilkSales.AddAsync(sale);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Milk sale recorded.", total = sale.TotalAmount });
    }

    // Convert Milk into Mala
    [Authorize(Roles = "Admin")]
    [HttpPost("mala-produce")]
    public async Task<IActionResult> ProduceMala([FromBody] MalaProduction production)
    {
        production.Id = Guid.NewGuid();
        production.Date = DateTime.UtcNow.Date;

        await _context.MalaProductions.AddAsync(production);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Mala batch logged successfully." });
    }
}

public class LogMilkDto
{
    public Guid CowId { get; set; }
    public decimal QuantityLitres { get; set; }
    public string Shift { get; set; } = "Morning";
    public DateTime? Date { get; set; }
}