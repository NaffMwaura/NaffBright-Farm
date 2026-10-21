using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaffBrightFarm.Api.Data;

namespace NaffBrightFarm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // Strictly Admin only
public class EmployeesController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public EmployeesController(NaffBrightDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Fetch all registered farm employees
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllEmployees([FromQuery] bool? activeOnly)
    {
        var query = _context.Users
            .Include(u => u.Role)
            .Where(u => u.Role.Name == "Employee")
            .AsQueryable();

        if (activeOnly.HasValue && activeOnly.Value)
        {
            query = query.Where(u => u.IsActive);
        }

        var employees = await query
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.PhoneNumber,
                u.IsActive,
                u.MustChangePassword,
                u.CreatedAt,
                TotalShiftsWorked = u.Timesheets.Count(t => t.Status == "Approved"),
                TotalMilkLogs = _context.MilkRecords.Count(m => m.RecordedByUserId == u.Id)
            })
            .ToListAsync();

        return Ok(employees);
    }

    /// <summary>
    /// Toggle employee active status (Deactivate / Reactivate)
    /// </summary>
    [HttpPatch("{id:guid}/toggle-status")]
    public async Task<IActionResult> ToggleEmployeeStatus(Guid id)
    {
        var employee = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id && u.Role.Name == "Employee");

        if (employee == null)
        {
            return NotFound(new { message = "Employee not found." });
        }

        employee.IsActive = !employee.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = employee.IsActive 
                ? $"Employee {employee.FullName} has been reactivated." 
                : $"Employee {employee.FullName} has been deactivated and can no longer log in.",
            employeeId = employee.Id,
            isActive = employee.IsActive
        });
    }

    /// <summary>
    /// Delete an employee record completely
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEmployee(Guid id)
    {
        var employee = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id && u.Role.Name == "Employee");

        if (employee == null)
        {
            return NotFound(new { message = "Employee not found." });
        }

        // Check if employee has associated records that prevent deletion
        var hasMilkRecords = await _context.MilkRecords.AnyAsync(m => m.RecordedByUserId == id);
        if (hasMilkRecords)
        {
            return BadRequest(new 
            { 
                message = "Cannot permanently delete this employee because they have recorded historical milk yields. Please deactivate their account instead to revoke login access." 
            });
        }

        _context.Users.Remove(employee);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Employee {employee.FullName} permanently removed from system." });
    }
}