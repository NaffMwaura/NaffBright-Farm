using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.DTOs;
using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // Financial sales operations are restricted to Admin
public class SalesController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public SalesController(NaffBrightDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // 1. MILK SALES
    // ==========================================

    [HttpGet("milk")]
    public async Task<IActionResult> GetMilkSales([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _context.MilkSales.AsQueryable();

        if (startDate.HasValue)
            query = query.Where(s => s.SaleDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(s => s.SaleDate <= endDate.Value);

        var sales = await query
            .OrderByDescending(s => s.SaleDate)
            .Select(s => new
            {
                s.Id,
                s.CustomerName,
                s.LitresSold,
                s.PricePerLitre,
                TotalAmount = s.LitresSold * s.PricePerLitre,
                s.SaleDate
            })
            .ToListAsync();

        return Ok(sales);
    }

    [HttpPost("milk")]
    public async Task<IActionResult> RecordMilkSale([FromBody] CreateMilkSaleDto dto)
    {
        var sale = new MilkSale
        {
            Id = Guid.NewGuid(),
            CustomerName = dto.CustomerName.Trim(),
            LitresSold = dto.LitresSold,
            PricePerLitre = dto.PricePerLitre,
            SaleDate = dto.SaleDate ?? DateTime.UtcNow
        };

        await _context.MilkSales.AddAsync(sale);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMilkSaleById), new { id = sale.Id }, new
        {
            sale.Id,
            sale.CustomerName,
            sale.LitresSold,
            sale.PricePerLitre,
            TotalAmount = sale.LitresSold * sale.PricePerLitre,
            sale.SaleDate
        });
    }

    [HttpGet("milk/{id:guid}")]
    public async Task<IActionResult> GetMilkSaleById(Guid id)
    {
        var sale = await _context.MilkSales.FindAsync(id);
        if (sale == null) return NotFound(new { message = "Milk sale record not found." });

        return Ok(new
        {
            sale.Id,
            sale.CustomerName,
            sale.LitresSold,
            sale.PricePerLitre,
            TotalAmount = sale.LitresSold * sale.PricePerLitre,
            sale.SaleDate
        });
    }

    // ==========================================
    // 2. MALA SALES
    // ==========================================

    [HttpGet("mala")]
    public async Task<IActionResult> GetMalaSales([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _context.MalaSales.AsQueryable();

        if (startDate.HasValue)
            query = query.Where(s => s.SaleDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(s => s.SaleDate <= endDate.Value);

        var sales = await query
            .OrderByDescending(s => s.SaleDate)
            .Select(s => new
            {
                s.Id,
                s.CustomerName,
                s.QuantityLitres,
                s.UnitPrice,
                TotalAmount = s.QuantityLitres * s.UnitPrice,
                s.SaleDate
            })
            .ToListAsync();

        return Ok(sales);
    }

    [HttpPost("mala")]
    public async Task<IActionResult> RecordMalaSale([FromBody] CreateMalaSaleDto dto)
    {
        var sale = new MalaSale
        {
            Id = Guid.NewGuid(),
            CustomerName = dto.CustomerName.Trim(),
            QuantityLitres = dto.QuantityLitres,
            UnitPrice = dto.UnitPrice,
            SaleDate = dto.SaleDate ?? DateTime.UtcNow
        };

        await _context.MalaSales.AddAsync(sale);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Mala sale recorded successfully.",
            sale.Id,
            sale.CustomerName,
            sale.QuantityLitres,
            sale.UnitPrice,
            TotalAmount = sale.QuantityLitres * sale.UnitPrice,
            sale.SaleDate
        });
    }

    // ==========================================
    // 3. COW SALES (LIVESTOCK MARKETPLACE)
    // ==========================================

    [HttpGet("cows")]
    public async Task<IActionResult> GetCowSales()
    {
        var sales = await _context.CowSales
            .Include(cs => cs.Cow)
            .OrderByDescending(cs => cs.SaleDate)
            .Select(cs => new
            {
                cs.Id,
                cs.CowId,
                CowTag = cs.Cow.TagNumber,
                CowName = cs.Cow.Name,
                CowBreed = cs.Cow.Breed,
                cs.BuyerName,
                cs.Amount,
                cs.SaleDate
            })
            .ToListAsync();

        return Ok(sales);
    }

    [HttpPost("cows")]
    public async Task<IActionResult> RecordCowSale([FromBody] CreateCowSaleDto dto)
    {
        var cow = await _context.Cows.FindAsync(dto.CowId);
        if (cow == null)
            return NotFound(new { message = $"Cow with ID {dto.CowId} does not exist." });

        if (cow.Status == "Sold")
            return BadRequest(new { message = $"Cow {cow.TagNumber} has already been sold." });

        if (cow.Status == "Deceased" || cow.Status == "Dead")
            return BadRequest(new { message = $"Cannot sell cow {cow.TagNumber} because it is marked deceased." });

        // Update Cow status to Sold automatically
        cow.Status = "Sold";

        var cowSale = new CowSale
        {
            Id = Guid.NewGuid(),
            CowId = cow.Id,
            BuyerName = dto.BuyerName.Trim(),
            Amount = dto.Amount,
            SaleDate = dto.SaleDate ?? DateTime.UtcNow
        };

        await _context.CowSales.AddAsync(cowSale);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Cow {cow.TagNumber} marked as Sold to {cowSale.BuyerName}.",
            saleId = cowSale.Id,
            cowId = cow.Id,
            tagNumber = cow.TagNumber,
            saleAmount = cowSale.Amount,
            saleDate = cowSale.SaleDate
        });
    }

    // ==========================================
    // 4. UNIFIED SALES OVERVIEW / LEDGER
    // ==========================================

    [HttpGet("summary")]
    public async Task<IActionResult> GetSalesSummary()
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        // Daily figures
        var todayMilk = await _context.MilkSales
            .Where(s => s.SaleDate >= today)
            .SumAsync(s => (decimal?)(s.LitresSold * s.PricePerLitre)) ?? 0;

        var todayMala = await _context.MalaSales
            .Where(s => s.SaleDate >= today)
            .SumAsync(s => (decimal?)(s.QuantityLitres * s.UnitPrice)) ?? 0;

        var todayCows = await _context.CowSales
            .Where(s => s.SaleDate >= today)
            .SumAsync(s => (decimal?)s.Amount) ?? 0;

        // Month-to-date totals
        var monthMilk = await _context.MilkSales
            .Where(s => s.SaleDate >= startOfMonth)
            .SumAsync(s => (decimal?)(s.LitresSold * s.PricePerLitre)) ?? 0;

        var monthMala = await _context.MalaSales
            .Where(s => s.SaleDate >= startOfMonth)
            .SumAsync(s => (decimal?)(s.QuantityLitres * s.UnitPrice)) ?? 0;

        var monthCows = await _context.CowSales
            .Where(s => s.SaleDate >= startOfMonth)
            .SumAsync(s => (decimal?)s.Amount) ?? 0;

        var totalMonthRevenue = monthMilk + monthMala + monthCows;

        return Ok(new
        {
            today = new
            {
                milkSales = todayMilk,
                malaSales = todayMala,
                cowSales = todayCows,
                totalToday = todayMilk + todayMala + todayCows
            },
            monthToDate = new
            {
                milkSales = monthMilk,
                malaSales = monthMala,
                cowSales = monthCows,
                totalMonthRevenue
            }
        });
    }
}