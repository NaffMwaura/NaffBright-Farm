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
public class FeedInventoryController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public FeedInventoryController(NaffBrightDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllFeeds()
    {
        var feeds = await _context.FeedInventories
            .OrderBy(f => f.FeedName)
            .Select(f => new
            {
                f.Id,
                f.FeedName,
                f.QuantityKg,
                f.CostPerKg,
                f.ReorderThresholdKg,
                EstimatedTotalValue = f.QuantityKg * f.CostPerKg,
                IsLowStock = f.QuantityKg <= f.ReorderThresholdKg
            })
            .ToListAsync();

        return Ok(feeds);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddNewFeed([FromBody] CreateFeedDto dto)
    {
        var exists = await _context.FeedInventories
            .AnyAsync(f => f.FeedName.ToLower() == dto.FeedName.Trim().ToLower());

        if (exists)
            return BadRequest(new { message = $"Feed item '{dto.FeedName}' already exists in inventory." });

        var feed = new FeedInventory
        {
            Id = Guid.NewGuid(),
            FeedName = dto.FeedName.Trim(),
            QuantityKg = dto.QuantityKg,
            CostPerKg = dto.CostPerKg,
            ReorderThresholdKg = dto.ReorderThresholdKg
        };

        await _context.FeedInventories.AddAsync(feed);
        await _context.SaveChangesAsync();

        return Ok(feed);
    }

    [HttpPost("{id:guid}/adjust-stock")]
    public async Task<IActionResult> AdjustStock(Guid id, [FromBody] AdjustFeedStockDto dto)
    {
        var feed = await _context.FeedInventories.FindAsync(id);
        if (feed == null) return NotFound(new { message = "Feed item not found." });

        var newTotal = feed.QuantityKg + dto.ChangeInKg;
        if (newTotal < 0)
        {
            return BadRequest(new { 
                message = $"Cannot deduct {Math.Abs(dto.ChangeInKg)} Kg. Current stock is only {feed.QuantityKg} Kg." 
            });
        }

        feed.QuantityKg = newTotal;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Stock adjusted successfully.",
            feedId = feed.Id,
            feedName = feed.FeedName,
            updatedStockKg = feed.QuantityKg,
            isLowStock = feed.QuantityKg <= feed.ReorderThresholdKg,
            note = dto.Reason
        });
    }

    [HttpGet("low-stock-alerts")]
    public async Task<IActionResult> GetLowStockAlerts()
    {
        var alerts = await _context.FeedInventories
            .Where(f => f.QuantityKg <= f.ReorderThresholdKg)
            .Select(f => new
            {
                f.Id,
                f.FeedName,
                f.QuantityKg,
                f.ReorderThresholdKg,
                DeficitKg = f.ReorderThresholdKg - f.QuantityKg
            })
            .ToListAsync();

        return Ok(alerts);
    }
}