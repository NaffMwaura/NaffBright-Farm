using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CowsController(FarmDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cow>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await dbContext.Cows
            .AsNoTracking()
            .OrderBy(cow => cow.TagNumber)
            .ToListAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Cow>> GetById(int id, CancellationToken cancellationToken)
    {
        var cow = await dbContext.Cows
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        return cow is null ? NotFound() : Ok(cow);
    }

    [HttpPost]
    public async Task<ActionResult<Cow>> Create(Cow cow, CancellationToken cancellationToken)
    {
        dbContext.Cows.Add(cow);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = cow.Id }, cow);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var cow = await dbContext.Cows.FindAsync([id], cancellationToken);

        if (cow is null)
        {
            return NotFound();
        }

        dbContext.Cows.Remove(cow);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
