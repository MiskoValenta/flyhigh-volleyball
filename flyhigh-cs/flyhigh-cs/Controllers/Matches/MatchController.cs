using Application.DTOs.Matches;
using Application.Interfaces.Matches;
using Domain.Entities.Matches.MatchEnums;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Matches;

[ApiController]
[Route("api/matches")]
[Authorize]
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

  [HttpGet]
  public async Task<IActionResult> GetMyMatches(CancellationToken ct)
  {
    try
    {
      var matches = await _matchService.GetUserMatchesAsync(GetCurrentUserId(), ct);
      return Ok(matches);
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpGet("{matchId}")]
  public async Task<IActionResult> GetMatchDetail(Guid matchId, CancellationToken ct)
  {
    try
    {
      var detail = await _matchService.GetMatchByIdAsync(matchId, GetCurrentUserId(), ct);
      return Ok(detail);
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("propose")]
  public async Task<IActionResult> ProposeMatch([FromBody] CreateMatchDto dto, CancellationToken ct)
  {
    try
    {
      var matchId = await _matchService.ProposeMatchAsync(dto, GetCurrentUserId(), ct);
      return Ok(new { Id = matchId });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/accept")]
  public async Task<IActionResult> AcceptMatch(Guid matchId, CancellationToken ct)
  {
    try
    {
      await _matchService.AcceptMatchAsync(matchId, GetCurrentUserId(), ct);
      return Ok(new { message = "Zápas byl přijat." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/reject")]
  public async Task<IActionResult> RejectMatch(Guid matchId, CancellationToken ct)
  {
    try
    {
      await _matchService.RejectMatchAsync(matchId, ct);
      return Ok(new { message = "Zápas byl odmítnut." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/roster")]
  public async Task<IActionResult> AddPlayerToRoster(Guid matchId, [FromBody] RosterPlayerDto dto, CancellationToken ct)
  {
    try
    {
      await _matchService.AddPlayerToRosterAsync(matchId, dto, ct);
      return Ok(new { message = "Hráč byl přidán na soupisku." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/start")]
  public async Task<IActionResult> StartMatch(Guid matchId, CancellationToken ct)
  {
    try
    {
      await _matchService.StartMatchAsync(matchId, GetCurrentUserId(), ct);
      return Ok(new { message = "Zápas byl zahájen." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/sets/start")]
  public async Task<IActionResult> StartCurrentSet(Guid matchId, CancellationToken ct)
  {
    try
    {
      await _matchService.StartCurrentSetAsync(matchId, GetCurrentUserId(), ct);
      return Ok(new { message = "Set byl odstartován." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/positions")]
  public async Task<IActionResult> AssignPlayerPosition(Guid matchId, [FromBody] AssignPositionDto dto, CancellationToken ct)
  {
    try
    {
      await _matchService.AssignPlayerPositionAsync(matchId, GetCurrentUserId(), dto, ct);
      return Ok(new { message = "Pozice byla přiřazena." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/point/{side}")]
  public async Task<IActionResult> AddPoint(Guid matchId, SetSide side, CancellationToken ct)
  {
    try
    {
      await _matchService.AddPointAsync(matchId, GetCurrentUserId(), side, ct);
      return Ok(new { message = "Bod byl přidán." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/referee/{refereeId}")]
  public async Task<IActionResult> SetReferee(Guid matchId, Guid refereeId, CancellationToken ct)
  {
    try
    {
      await _matchService.SetRefereeAsync(matchId, refereeId, GetCurrentUserId(), ct);
      return Ok(new { message = "Rozhodčí byl nastaven." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }

  [HttpPost("{matchId}/cancel")]
  public async Task<IActionResult> CancelMatch(Guid matchId, [FromBody] CancelMatchDto dto, CancellationToken ct)
  {
    try
    {
      await _matchService.CancelMatchAsync(matchId, GetCurrentUserId(), dto, ct);
      return Ok(new { message = "Zápas byl zrušen." });
    }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
  }
}
