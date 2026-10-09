using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // Only farm owner can access financials
public class ReportsController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public ReportsController(NaffBrightDbContext context)
    {
        _context = context;
    }

    [HttpGet("profit-and-loss")]
    public async Task<IActionResult> GetProfitAndLoss([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
        var end = endDate ?? DateTime.UtcNow;

        // 1. REVENUE CALCULATION
        var milkSalesRevenue = await _context.MilkSales
            .Where(s => s.SaleDate >= start && s.SaleDate <= end)
            .SumAsync(s => (decimal?)(s.LitresSold * s.PricePerLitre)) ?? 0;

        var malaSalesRevenue = await _context.MalaSales
            .Where(s => s.SaleDate >= start && s.SaleDate <= end)
            .SumAsync(s => (decimal?)(s.QuantityLitres * s.UnitPrice)) ?? 0;

        var cowSalesRevenue = await _context.CowSales
            .Where(s => s.SaleDate >= start && s.SaleDate <= end)
            .SumAsync(s => (decimal?)s.Amount) ?? 0;

        var totalRevenue = milkSalesRevenue + malaSalesRevenue + cowSalesRevenue;

        // 2. EXPENSES CALCULATION
        var operationalExpenses = await _context.Expenses
            .Where(e => e.Date >= start && e.Date <= end)
            .SumAsync(e => (decimal?)e.Amount) ?? 0;

        var vetExpenses = await _context.HealthRecords
            .Where(h => h.Date >= start && h.Date <= end)
            .SumAsync(h => (decimal?)h.TreatmentCost) ?? 0;

        var totalExpenses = operationalExpenses + vetExpenses;

        // 3. NET PROFIT
        var netProfit = totalRevenue - totalExpenses;

        return Ok(new
        {
            period = new { from = start, to = end },
            revenue = new
            {
                milkSales = milkSalesRevenue,
                malaSales = malaSalesRevenue,
                cowSales = cowSalesRevenue,
                totalRevenue
            },
            expenses = new
            {
                generalOperations = operationalExpenses,
                veterinaryCosts = vetExpenses,
                totalExpenses
            },
            netProfit,
            profitMarginPercent = totalRevenue > 0 ? Math.Round((netProfit / totalRevenue) * 100, 2) : 0
        });
    }

    [HttpGet("dashboard-kpis")]
    public async Task<IActionResult> GetDashboardKpis()
    {
        var today = DateTime.UtcNow.Date;

        var totalCows = await _context.Cows.CountAsync();
        var healthyCows = await _context.Cows.CountAsync(c => c.Status == "Healthy");
        var pregnantCows = await _context.Cows.CountAsync(c => c.Status == "Pregnant");
        var sickCows = await _context.Cows.CountAsync(c => c.Status == "Sick");

        var todayMilkOutput = await _context.MilkRecords
            .Where(m => m.Date == today)
            .SumAsync(m => (decimal?)m.QuantityLitres) ?? 0;

        var todayMilkSales = await _context.MilkSales
            .Where(s => s.SaleDate.Date == today)
            .SumAsync(s => (decimal?)(s.LitresSold * s.PricePerLitre)) ?? 0;

        var lowFeedAlerts = await _context.FeedInventories
            .Where(f => f.QuantityKg <= f.ReorderThresholdKg)
            .Select(f => new { f.FeedName, f.QuantityKg, f.ReorderThresholdKg })
            .ToListAsync();

        return Ok(new
        {
            totalCows,
            healthyCows,
            pregnantCows,
            sickCows,
            todayMilkOutputLitres = todayMilkOutput,
            todaySalesAmount = todayMilkSales,
            lowFeedAlerts
        });
    }
}