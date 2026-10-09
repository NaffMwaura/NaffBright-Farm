using System.Security.Claims;
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
public class TimesheetsController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public TimesheetsController(NaffBrightDbContext context)
    {
        _context = context;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitTimesheet([FromBody] SubmitTimesheetDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var currentUserId)) return Unauthorized();

        var timesheet = new Timesheet
        {
            Id = Guid.NewGuid(),
            UserId = currentUserId,
            WorkDate = dto.WorkDate ?? DateTime.UtcNow.Date,
            HoursWorked = dto.HoursWorked,
            TasksCompleted = dto.TasksCompleted.Trim(),
            Status = "Pending",
            ApprovedPaymentAmount = null
        };

        await _context.Timesheets.AddAsync(timesheet);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Timesheet submitted for admin approval.", timesheetId = timesheet.Id });
    }

    [HttpGet("my-timesheets")]
    public async Task<IActionResult> GetMyTimesheets()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var currentUserId)) return Unauthorized();

        var timesheets = await _context.Timesheets
            .Where(t => t.UserId == currentUserId)
            .OrderByDescending(t => t.WorkDate)
            .Select(t => new TimesheetResponseDto
            {
                Id = t.Id,
                UserId = t.UserId,
                EmployeeName = t.User.FullName,
                WorkDate = t.WorkDate,
                HoursWorked = t.HoursWorked,
                TasksCompleted = t.TasksCompleted,
                Status = t.Status,
                ApprovedPaymentAmount = t.ApprovedPaymentAmount
            })
            .ToListAsync();

        return Ok(timesheets);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllTimesheets([FromQuery] string? status)
    {
        var query = _context.Timesheets.Include(t => t.User).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(t => t.Status.ToLower() == status.ToLower());

        var list = await query
            .OrderByDescending(t => t.WorkDate)
            .Select(t => new TimesheetResponseDto
            {
                Id = t.Id,
                UserId = t.UserId,
                EmployeeName = t.User.FullName,
                WorkDate = t.WorkDate,
                HoursWorked = t.HoursWorked,
                TasksCompleted = t.TasksCompleted,
                Status = t.Status,
                ApprovedPaymentAmount = t.ApprovedPaymentAmount
            })
            .ToListAsync();

        return Ok(list);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:guid}/review")]
    public async Task<IActionResult> ReviewTimesheet(Guid id, [FromBody] ReviewTimesheetDto dto)
    {
        var timesheet = await _context.Timesheets.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
        if (timesheet == null) return NotFound(new { message = "Timesheet record not found." });

        timesheet.Status = dto.Status;
        timesheet.ApprovedPaymentAmount = dto.Status == "Approved" ? dto.ApprovedPaymentAmount : null;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Timesheet marked as {dto.Status}.",
            timesheetId = timesheet.Id,
            employee = timesheet.User.FullName,
            status = timesheet.Status,
            payout = timesheet.ApprovedPaymentAmount
        });
    }
}