using Application.Common.Interfaces;
using Application.DTOs.Events;
using Application.DTOs.Matches;
using Application.Interfaces.Events;
using Application.Interfaces.Matches;
using Application.Interfaces.Teams;
using Domain.Entities.Matches;
using Domain.Entities.Matches.Exceptions;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Matches.Rules;
using Domain.Repositories.Matches;
using Domain.Repositories.Teams;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;

public class MatchService : IMatchService
{
  private readonly IMatchRepository _matchRepository;
  private readonly IUnitOfWork _unitOfWork;
  private readonly ITeamAuthorizationService _teamAuth;

  public MatchService(
      IMatchRepository matchRepository,
      IUnitOfWork unitOfWork,
      ITeamAuthorizationService teamAuth)
  {
    _matchRepository = matchRepository;
    _unitOfWork = unitOfWork;
    _teamAuth = teamAuth;
  }

  public async Task<MatchDto> CreateMatchAsync(Guid userId, CreateMatchRequest request)
  {
    bool isAuthorized = await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), new TeamId(request.HomeTeamId));
    if (!isAuthorized) throw new MatchInvalidException("Pouze Coach nebo Owner domácího týmu může vytvořit zápas.");

    var match = Match.Create(
        new TeamId(request.HomeTeamId),
        new TeamId(request.AwayTeamId),
        request.Location,
        request.ScheduledDate);

    await _matchRepository.AddAsync(match);
    await _unitOfWork.SaveChangesAsync();

    return MapToDto(match);
  }

  public async Task AcceptMatchAsync(Guid userId, Guid matchId)
  {
    var match = await GetMatchOrThrow(matchId);

    bool isAuthorized = await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.AwayTeamId);
    if (!isAuthorized) throw new MatchInvalidException("Pouze hostující tým může přijmout pozvánku.");

    match.AcceptMatch();
    await _unitOfWork.SaveChangesAsync();
  }

  public async Task RejectMatchAsync(Guid userId, Guid matchId)
  {
    var match = await GetMatchOrThrow(matchId);

    bool isAuthorized = await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.AwayTeamId);
    if (!isAuthorized) throw new MatchInvalidException("Pouze hostující tým může odmítnout pozvánku.");

    _matchRepository.Remove(match);
    await _unitOfWork.SaveChangesAsync();
  }

  public async Task CancelMatchAsync(Guid userId, Guid matchId)
  {
    var match = await GetMatchOrThrow(matchId);

    bool isAuthorized = await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.HomeTeamId);
    if (!isAuthorized) throw new MatchInvalidException("Pouze zakladatel může zrušit zápas.");

    match.CancelMatch();
    await _unitOfWork.SaveChangesAsync();
  }

  public async Task AddRefereeAsync(Guid userId, Guid matchId, Guid refereeId)
  {
    var match = await GetMatchOrThrow(matchId);

    bool isAuthorized = await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.HomeTeamId);
    if (!isAuthorized) throw new MatchInvalidException("Pouze zakladatel může přidat rozhodčího.");

    match.SetReferee(new UserId(refereeId));
    await _unitOfWork.SaveChangesAsync();
  }

  public async Task AddToRosterAsync(Guid userId, Guid matchId, AddToRosterRequest request)
  {
    var match = await GetMatchOrThrow(matchId);

    TeamId? actingTeamId = null;
    if (await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.HomeTeamId)) actingTeamId = match.HomeTeamId;
    else if (await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.AwayTeamId)) actingTeamId = match.AwayTeamId;

    if (actingTeamId == null) throw new MatchInvalidException("Nemáte oprávnění spravovat soupisku žádného týmu v tomto zápase.");

    match.AddToRoster(actingTeamId, new UserId(request.UserId), request.JerseyNumber);
    await _unitOfWork.SaveChangesAsync();
  }

  public async Task StartNextSetAsync(Guid userId, Guid matchId, StartSetRequest request)
  {
    var match = await GetMatchOrThrow(matchId);

    bool isAuthorized = await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.HomeTeamId);
    if (!isAuthorized) throw new MatchInvalidException("Pouze zakladatel může zahájit set.");

    var setups = request.PlayerPositions.Select(p => (
        new TeamId(p.TeamId),
        new UserId(p.UserId),
        Enum.Parse<PlayerPosition>(p.Position)
    ));

    match.StartNextSet(setups);
    await _unitOfWork.SaveChangesAsync();
  }

  public async Task RecordPointAsync(Guid userId, Guid matchId, RecordPointRequest request)
  {
    var match = await GetMatchOrThrow(matchId);

    bool isAuthorized = await _teamAuth.IsAtLeastCoachAsync(new UserId(userId), match.HomeTeamId);
    if (!isAuthorized) throw new MatchInvalidException("Pouze zakladatel může zapisovat body.");

    match.RecordPoint(new TeamId(request.ScoringTeamId));
    await _unitOfWork.SaveChangesAsync();
  }

  public async Task<MatchDto?> GetByIdAsync(Guid matchId)
  {
    var match = await _matchRepository.GetByIdAsync(new MatchId(matchId));
    return match != null ? MapToDto(match) : null;
  }

  public async Task<List<MatchDto>> GetTeamMatchesAsync(Guid teamId)
  {
    var matches = await _matchRepository.GetMatchesByTeamIdAsync(new TeamId(teamId));
    return matches.OrderByDescending(m => m.ScheduledDate).Select(MapToDto).ToList();
  }

  private async Task<Match> GetMatchOrThrow(Guid matchId)
  {
    var match = await _matchRepository.GetByIdAsync(new MatchId(matchId));
    if (match == null) throw new MatchInvalidException("Zápas nebyl nalezen.");
    return match;
  }

  private MatchDto MapToDto(Match m)
  {
    return new MatchDto(
        m.Id.Value,
        m.HomeTeamId.Value,
        m.AwayTeamId.Value,
        m.RefereeId?.Value,
        m.Location,
        m.ScheduledDate,
        m.Status.ToString(),
        m.HomeSetsWon,
        m.AwaySetsWon,
        m.Roster.Select(r => new MatchRosterDto(r.UserId.Value, r.TeamId.Value, r.JerseyNumber)).ToList(),
        m.Sets.Select(s => new MatchSetDto(
            s.Id.Value,
            s.SetNumber,
            s.HomeTeamScore,
            s.AwayTeamScore,
            s.IsCompleted,
            s.WinnerTeamId?.Value,
            s.PlayerPositions.Select(p => new MatchPlayerPositionDto(p.UserId.Value, p.TeamId.Value, p.Position.ToString())).ToList()
        )).ToList()
    );
  }
}