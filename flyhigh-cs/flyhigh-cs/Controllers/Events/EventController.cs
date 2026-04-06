using Application.DTOs.Events;
using Application.Interfaces.Events;
using Domain.Entities.Users;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.Events;

[ApiController]
[Route("api/events")]
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

  [HttpPost]
  public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto, CancellationToken ct)
  {
    var currentUser = GetCurrentUserId();
    try
    {
      var eventId = await _eventService.CreateEventAsync(dto, currentUser, ct);

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
    var currentUser = GetCurrentUserId();

    try
    {
      var result = await _eventService.GetTeamEventsAsync(teamId, currentUser, ct);
      return Ok(result);
    }catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("{eventId}")]
  public async Task<IActionResult> GetEventDetail(Guid eventId, CancellationToken ct)
  {
    var currentUser = GetCurrentUserId();

    try
    {
      var detail = await _eventService.GetEventDetailAsync(eventId, currentUser, ct);
      return Ok(detail);
    }catch (Exception ex)
    {
      return NotFound(new { message = ex.Message });
    }
  }

  [HttpPost("{eventId}/respond")]
  public async Task<IActionResult> RespondToEvent(Guid eventId, [FromBody] RespondToEventDto dto, CancellationToken ct)
  {
    var currentUser = GetCurrentUserId();

    try
    {
      await _eventService.RespondToEventAsync(eventId, currentUser, dto.Response, ct);
      return Ok(new { message = "Odpověď zaznamenána." });
    }catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpDelete("{eventId}")]
  public async Task<IActionResult> DeleteEvent(Guid eventId, CancellationToken ct)
  {
    var currentUser = GetCurrentUserId();

    try
    {
      await _eventService.DeleteEventAsync(eventId, currentUser, ct);

      return NoContent();
    }catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}
