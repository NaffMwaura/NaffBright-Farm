using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;
using NaffBrightFarm.Api.DTOs;
using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // Farm operational costs are admin-restricted
public class ExpensesController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public ExpensesController(NaffBrightDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetExpenses(
        [FromQuery] string? category, 
        [FromQuery] DateTime? startDate, 
        [FromQuery] DateTime? endDate)
    {
        var query = _context.Expenses.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(e => e.Category.ToLower() == category.ToLower());

        if (startDate.HasValue)
            query = query.Where(e => e.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(e => e.Date <= endDate.Value);

        var expenses = await query
            .OrderByDescending(e => e.Date)
            .ToListAsync();

        return Ok(expenses);
    }

    [HttpPost]
    public async Task<IActionResult> LogExpense([FromBody] CreateExpenseDto dto)
    {
        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            Category = dto.Category.Trim(),
            Amount = dto.Amount,
            Description = dto.Description.Trim(),
            Date = dto.Date ?? DateTime.UtcNow
        };

        await _context.Expenses.AddAsync(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateExpense(Guid id, [FromBody] UpdateExpenseDto dto)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound(new { message = "Expense record not found." });

        if (!string.IsNullOrWhiteSpace(dto.Category)) expense.Category = dto.Category.Trim();
        if (dto.Amount.HasValue) expense.Amount = dto.Amount.Value;
        if (!string.IsNullOrWhiteSpace(dto.Description)) expense.Description = dto.Description.Trim();
        if (dto.Date.HasValue) expense.Date = dto.Date.Value;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Expense updated successfully.", expense });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteExpense(Guid id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Expense deleted successfully." });
    }

    [HttpGet("categories-breakdown")]
    public async Task<IActionResult> GetCategoryBreakdown([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
        var end = endDate ?? DateTime.UtcNow;

        var breakdown = await _context.Expenses
            .Where(e => e.Date >= start && e.Date <= end)
            .GroupBy(e => e.Category)
            .Select(g => new
            {
                Category = g.Key,
                TotalAmount = g.Sum(e => e.Amount),
                Count = g.Count()
            })
            .OrderByDescending(g => g.TotalAmount)
            .ToListAsync();

        return Ok(breakdown);
    }
}