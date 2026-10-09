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
public class MessagesController : ControllerBase
{
    private readonly NaffBrightDbContext _context;

    public MessagesController(NaffBrightDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages([FromQuery] string? type)
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var currentUserId)) return Unauthorized();

        var query = _context.EmployeeMessages
            .Include(m => m.Sender)
            .AsQueryable();

        // Employees only see their own reports/inquiries + all Admin instructions
        if (role == "Employee")
        {
            query = query.Where(m => m.SenderId == currentUserId || m.MessageType == "Instruction");
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(m => m.MessageType.ToLower() == type.ToLower());
        }

        var messages = await query
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new MessageResponseDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender.FullName,
                SenderEmail = m.Sender.Email,
                MessageType = m.MessageType,
                Subject = m.Subject,
                Content = m.Content,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var currentUserId)) return Unauthorized();

        var role = User.FindFirstValue(ClaimTypes.Role);

        // Only Admin can issue Instructions
        if (dto.MessageType == "Instruction" && role != "Admin")
        {
            return Forbid("Only an Administrator can broadcast instructions.");
        }

        var message = new EmployeeMessage
        {
            Id = Guid.NewGuid(),
            SenderId = currentUserId,
            MessageType = dto.MessageType,
            Subject = dto.Subject.Trim(),
            Content = dto.Content.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.EmployeeMessages.AddAsync(message);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Message dispatched successfully.", id = message.Id });
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var message = await _context.EmployeeMessages.FindAsync(id);
        if (message == null) return NotFound(new { message = "Message not found." });

        message.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Status updated to Read." });
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var currentUserId)) return Unauthorized();

        int count;
        if (role == "Admin")
        {
            // Admin cares about unread staff Inquiries and Reports
            count = await _context.EmployeeMessages
                .CountAsync(m => !m.IsRead && m.MessageType != "Instruction");
        }
        else
        {
            // Employee cares about unread Instructions from Admin
            count = await _context.EmployeeMessages
                .CountAsync(m => !m.IsRead && m.MessageType == "Instruction");
        }

        return Ok(new { unreadCount = count });
    }
}