using Application.DTOs.Events;
using Application.Interfaces.Events;
using Domain.Entities.Users;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.Events;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventController : ControllerBase
{
  private readonly IEventService _eventService;

  public EventController(IEventService eventService)
  {
    _eventService = eventService;
  }

  private Guid GetCurrentUserId()
  {
    return User.GetUserId();
  }

  [HttpPost("create")]
  public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto, CancellationToken ct)
  {
    try
    {
      var eventId = await _eventService.CreateEventAsync(dto, GetCurrentUserId(), ct);
      return Ok(new { Id = eventId });
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("team/{teamId}")]
  public async Task<IActionResult> GetTeamEvents(Guid teamId, CancellationToken ct)
  {
    try
    {
      var events = await _eventService.GetTeamEventsAsync(teamId, GetCurrentUserId(), ct);
      return Ok(events);
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("{eventId}")]
  public async Task<IActionResult> GetEventDetail(Guid eventId, CancellationToken ct)
  {
    try
    {
      var detail = await _eventService.GetEventDetailAsync(eventId, GetCurrentUserId(), ct);
      return Ok(detail);
    }
    catch (Exception ex)
    {
      return NotFound(new { message = ex.Message });
    }
  }

  [HttpPost("{eventId}/respond")]
  public async Task<IActionResult> RespondToEvent(Guid eventId, [FromBody] RespondToEventDto dto, CancellationToken ct)
  {
    try
    {
      await _eventService.RespondToEventAsync(eventId, GetCurrentUserId(), dto.Response, ct);
      return Ok(new { message = "Odpověď zaznamenána." });
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpDelete("{eventId}")]
  public async Task<IActionResult> DeleteEvent(Guid eventId, CancellationToken ct)
  {
    try
    {
      await _eventService.DeleteEventAsync(eventId, GetCurrentUserId(), ct);
      return NoContent();
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}