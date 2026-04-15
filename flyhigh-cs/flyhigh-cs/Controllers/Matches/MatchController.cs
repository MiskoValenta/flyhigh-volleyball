using Application.DTOs.Matches;
using Application.Interfaces.Matches;
using Domain.Entities.Matches.Exceptions;
using Domain.Entities.Matches.MatchEnums;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Matches;

[Authorize]
[ApiController]
[Route("api/matches")]
public class MatchController : ControllerBase
{
  private readonly IMatchService _matchService;

  public MatchController(IMatchService matchService)
  {
    _matchService = matchService;
  }

  private Guid GetCurrentUserId()
  {
    return User.GetUserId();
  }

  [HttpPost]
  public async Task<ActionResult<MatchDto>> CreateMatch([FromBody] CreateMatchRequest request)
  {
    try
    {
      var match = await _matchService.CreateMatchAsync(GetCurrentUserId(), request);
      return Ok(match);
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/accept")]
  public async Task<IActionResult> AcceptMatch(Guid id)
  {
    try
    {
      await _matchService.AcceptMatchAsync(GetCurrentUserId(), id);
      return NoContent();
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> RejectMatch(Guid id)
  {
    try
    {
      await _matchService.RejectMatchAsync(GetCurrentUserId(), id);
      return NoContent();
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/cancel")]
  public async Task<IActionResult> CancelMatch(Guid id)
  {
    try
    {
      await _matchService.CancelMatchAsync(GetCurrentUserId(), id);
      return NoContent();
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/referee/{refereeId:guid}")]
  public async Task<IActionResult> AddReferee(Guid id, Guid refereeId)
  {
    try
    {
      await _matchService.AddRefereeAsync(GetCurrentUserId(), id, refereeId);
      return NoContent();
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/roster")]
  public async Task<IActionResult> AddToRoster(Guid id, [FromBody] AddToRosterRequest request)
  {
    try
    {
      await _matchService.AddToRosterAsync(GetCurrentUserId(), id, request);
      return NoContent();
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/sets")]
  public async Task<IActionResult> StartNextSet(Guid id, [FromBody] StartSetRequest request)
  {
    try
    {
      await _matchService.StartNextSetAsync(GetCurrentUserId(), id, request);
      return NoContent();
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/points")]
  public async Task<IActionResult> RecordPoint(Guid id, [FromBody] RecordPointRequest request)
  {
    try
    {
      await _matchService.RecordPointAsync(GetCurrentUserId(), id, request);
      return NoContent();
    }
    catch (MatchInvalidException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<MatchDto>> GetById(Guid id)
  {
    var match = await _matchService.GetByIdAsync(id);
    if (match == null) return NotFound();
    return Ok(match);
  }

  [HttpGet("team/{teamId:guid}")]
  public async Task<ActionResult<List<MatchDto>>> GetTeamMatches(Guid teamId)
  {
    var matches = await _matchService.GetTeamMatchesAsync(teamId);
    return Ok(matches);
  }
}