using Domain.Common;
using Domain.Entities.Matches.Exceptions;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Matches.Rules;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public sealed class Match : Entity<MatchId>
{
  public TeamId HomeTeamId { get; private set; }
  public TeamId AwayTeamId { get; private set; }
  public UserId? RefereeId { get; private set; }
  public string Location { get; private set; }
  public DateTime ScheduledDate { get; private set; }
  public MatchStatus Status { get; private set; }

  public int HomeSetsWon { get; private set; }
  public int AwaySetsWon { get; private set; }

  private readonly List<MatchSet> _sets = new();
  public IReadOnlyCollection<MatchSet> Sets => _sets.AsReadOnly();

  private readonly List<MatchRosterEntry> _roster = new();
  public IReadOnlyCollection<MatchRosterEntry> Roster => _roster.AsReadOnly();

  private Match() { }

  private Match(MatchId id, TeamId homeTeamId, TeamId awayTeamId, string location, DateTime scheduledDate)
      : base(id)
  {
    HomeTeamId = homeTeamId;
    AwayTeamId = awayTeamId;
    Location = location;
    ScheduledDate = scheduledDate;
    Status = MatchStatus.Pending;
    HomeSetsWon = 0;
    AwaySetsWon = 0;
  }

  public static Match Create(
    TeamId homeTeamId, 
    TeamId awayTeamId, 
    string location, 
    DateTime scheduledDate)
  {
    var newId = MatchId.New();

    var match = new Match(
      newId,
      homeTeamId,
      awayTeamId,
      location,
      scheduledDate);

    return match;
  }

  public void AcceptMatch()
  {
    if (Status != MatchStatus.Pending)
      throw new MatchInvalidException("Lze přijmout pouze zápasy ve stavu Pending.");

    Status = MatchStatus.Accepted;
  }

  public void CancelMatch()
  {
    Status = MatchStatus.Cancelled;
  }

  public void SetReferee(UserId refereeId)
  {
    if (Status != MatchStatus.Accepted)
      throw new MatchInvalidException("Rozhodčího lze přidat pouze po přijetí zápasu před jeho začátkem.");

    RefereeId = refereeId;
  }

  public void AddToRoster(TeamId teamId, UserId userId, int jerseyNumber)
  {
    if (Status != MatchStatus.Accepted)
      throw new MatchInvalidException("Soupisku lze upravovat pouze ve fázi přípravy (Accepted).");

    if (teamId != HomeTeamId && teamId != AwayTeamId)
      throw new MatchInvalidException("Tým nepatří do tohoto zápasu.");

    if (_roster.Any(r => r.UserId == userId))
      throw new MatchInvalidException("Hráč již na soupisce je.");

    if (_roster.Any(r => r.TeamId == teamId && r.JerseyNumber == jerseyNumber))
      throw new MatchInvalidException($"Číslo dresu {jerseyNumber} je v tomto týmu již zabráno.");

    _roster.Add(MatchRosterEntry.Create(Id, teamId, userId, jerseyNumber));
  }

  public void StartNextSet(IEnumerable<(TeamId TeamId, UserId UserId, PlayerPosition Position)> playerPositionsForSet)
  {
    if (Status == MatchStatus.Finished || Status == MatchStatus.Cancelled)
      throw new MatchInvalidException("Zápas je již ukončen nebo zrušen.");

    if (Status == MatchStatus.Accepted)
      Status = MatchStatus.InProgress;

    if (_sets.Any(s => !s.IsCompleted))
      throw new MatchInvalidException("Předchozí set ještě nebyl dohrán.");

    foreach (var pos in playerPositionsForSet)
    {
      if (!_roster.Any(r => r.UserId == pos.UserId && r.TeamId == pos.TeamId))
        throw new MatchInvalidException($"Hráč s ID {pos.UserId} není zapsán na soupisce týmu.");
    }

    int nextSetNumber = _sets.Count + 1;
    _sets.Add(MatchSet.Create(Id, nextSetNumber, playerPositionsForSet));
  }

  public void RecordPoint(TeamId scoringTeamId)
  {
    if (Status != MatchStatus.InProgress)
      throw new MatchInvalidException("Body lze přidávat pouze v průběhu zápasu.");

    var activeSet = _sets.SingleOrDefault(s => !s.IsCompleted);
    if (activeSet == null)
      throw new MatchInvalidException("Žádný set momentálně neprobíhá. Zahajte další set.");

    activeSet.RecordPoint(scoringTeamId, HomeTeamId, AwayTeamId);

    if (activeSet.IsCompleted)
    {
      if (activeSet.WinnerTeamId == HomeTeamId) HomeSetsWon++;
      if (activeSet.WinnerTeamId == AwayTeamId) AwaySetsWon++;

      if (VolleyballMatchRules.IsMatchFinished(HomeSetsWon, AwaySetsWon))
      {
        Status = MatchStatus.Finished;
      }
    }
  }
}
