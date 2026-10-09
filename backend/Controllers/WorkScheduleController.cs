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
public class WorkScheduleController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public WorkScheduleController(NaffBrightDbContext context)
    {
        _context = context;
    }

    [HttpGet("my-schedule")]
    public async Task<IActionResult> GetMySchedule([FromQuery] DateTime? startDate)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var currentUserId)) return Unauthorized();

        var queryDate = startDate ?? DateTime.UtcNow.Date;

        var schedules = await _context.WorkSchedules
            .Where(s => s.UserId == currentUserId && s.ShiftDate >= queryDate)
            .OrderBy(s => s.ShiftDate)
            .Select(s => new WorkScheduleResponseDto
            {
                Id = s.Id,
                UserId = s.UserId,
                EmployeeName = s.User.FullName,
                EmployeeEmail = s.User.Email,
                ShiftDate = s.ShiftDate,
                ShiftName = s.ShiftName,
                AssignedDuty = s.AssignedDuty
            })
            .ToListAsync();

        return Ok(schedules);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllSchedules([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var query = _context.WorkSchedules.Include(s => s.User).AsQueryable();

        if (fromDate.HasValue)
            query = query.Where(s => s.ShiftDate >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(s => s.ShiftDate <= toDate.Value);

        var schedules = await query
            .OrderBy(s => s.ShiftDate)
            .Select(s => new WorkScheduleResponseDto
            {
                Id = s.Id,
                UserId = s.UserId,
                EmployeeName = s.User.FullName,
                EmployeeEmail = s.User.Email,
                ShiftDate = s.ShiftDate,
                ShiftName = s.ShiftName,
                AssignedDuty = s.AssignedDuty
            })
            .ToListAsync();

        return Ok(schedules);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AssignSchedule([FromBody] CreateWorkScheduleDto dto)
    {
        var employee = await _context.Users.FindAsync(dto.UserId);
        if (employee == null) return NotFound(new { message = "Employee not found." });

        var schedule = new WorkSchedule
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            ShiftDate = DateTime.SpecifyKind(dto.ShiftDate.Date, DateTimeKind.Utc),
            ShiftName = dto.ShiftName,
            AssignedDuty = dto.AssignedDuty.Trim()
        };

        await _context.WorkSchedules.AddAsync(schedule);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Shift assigned to {employee.FullName}.", scheduleId = schedule.Id });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSchedule(Guid id)
    {
        var schedule = await _context.WorkSchedules.FindAsync(id);
        if (schedule == null) return NotFound();

        _context.WorkSchedules.Remove(schedule);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Schedule shift removed." });
    }
}