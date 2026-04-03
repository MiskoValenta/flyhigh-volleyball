using Domain.Common;
using Domain.Entities.Matches.Exceptions;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Matches.Rules;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Domain.Entities.Matches;

public class Match : AuditableEntity<MatchId>
{
  public UserId CreatorId { get; private set; }
  public TeamId HomeTeamId { get; private set; }
  public TeamId AwayTeamId { get; private set; }
  public DateTime ScheduledAt { get; private set; }
  public string Location { get; private set; }
  public MatchStatus Status { get; private set; }
  public UserId? RefereeId { get; private set; }
  public TeamId? WinnerId { get; private set; }

  private readonly List<MatchRosterEntry> _roster = new();
  public IReadOnlyCollection<MatchRosterEntry> Roster => _roster.AsReadOnly();

  private readonly List<MatchSet> _sets = new();
  public IReadOnlyCollection<MatchSet> Sets => _sets.AsReadOnly();

  private Match() { }

  private Match(MatchId id, UserId creatorId, TeamId homeTeamId, TeamId awayTeamId, DateTime scheduledAt, string location, MatchStatus status, UserId? refereeId = null)
      : base(id)
  {
    CreatorId = creatorId;
    HomeTeamId = homeTeamId;
    AwayTeamId = awayTeamId;
    ScheduledAt = scheduledAt;
    Location = location;
    Status = status;
    RefereeId = refereeId;
  }

  public static Match CreateInvitation(UserId creatorId, TeamId homeTeamId, TeamId awayTeamId, DateTime scheduledAt, string location, UserId? refereeId = null)
  {
    if (homeTeamId == awayTeamId)
    {
      throw new MatchInvalidException("Tým nemůže hrát sám proti sobě.");
    }

    if (scheduledAt <= DateTime.UtcNow)
    {
      throw new MatchInvalidException("Zápas musí být naplánován do budoucnosti.");
    }

    return new Match(new MatchId(Guid.NewGuid()), creatorId, homeTeamId, awayTeamId, scheduledAt, location, MatchStatus.Pending, refereeId);
  }

  public void AcceptInvitation()
  {
    if (Status != MatchStatus.Pending)
    {
      throw new MatchInvalidException("Pouze navržené zápasy lze přijmout.");
    }

    Status = MatchStatus.Accepted;
  }

  public void RejectInvitation()
  {
    if (Status != MatchStatus.Pending)
    {
      throw new MatchInvalidException("Pouze navržené zápasy lze odmítnout.");
    }

    Status = MatchStatus.Rejected;
  }

  public void SetReferee(UserId refereeId)
  {
    if (Status != MatchStatus.Pending)
    {
      if (Status != MatchStatus.Accepted)
      {
        throw new MatchInvalidException("Rozhodčího nelze nastavit, pokud je zápas již spuštěn nebo ukončen.");
      }
    }
    RefereeId = refereeId;
  }

  public void AddToRoster(TeamMemberId memberId, TeamId teamId, int jerseyNumber)
  {
    if (Status != MatchStatus.Accepted)
    {
      throw new MatchInvalidException("Hráče lze přidávat na soupisku pouze po přijetí zápasu.");
    }

    if (teamId != HomeTeamId)
    {
      if (teamId != AwayTeamId)
      {
        throw new MatchInvalidException("Hráč musí patřit k jednomu z týmů v tomto zápase.");
      }
    }

    var exists = false;
    foreach (var r in _roster)
    {
      if (r.TeamMemberId == memberId)
      {
        exists = true;
      }
    }

    if (exists)
    {
      throw new MatchInvalidException("Hráč je již na soupisce.");
    }

    var hasJersey = false;
    foreach (var r in _roster)
    {
      if (r.TeamId == teamId)
      {
        if (r.JerseyNumber == jerseyNumber)
        {
          hasJersey = true;
        }
      }
    }

    if (hasJersey)
    {
      throw new MatchInvalidException($"Číslo dresu {jerseyNumber} je již v týmu obsazeno.");
    }

    _roster.Add(new MatchRosterEntry(new MatchRosterEntryId(Guid.NewGuid()), Id, memberId, teamId, jerseyNumber));
  }

  public void AssignPlayerPositionForSet(int setNumber, TeamMemberId memberId, PlayerPosition position)
  {
    if (Status != MatchStatus.InProgress)
    {
      throw new MatchInvalidException("Pozice lze přiřazovat pouze probíhajícímu zápasu.");
    }

    var set = _sets.FirstOrDefault(s => s.SetNumber == setNumber);
    if (set == null)
    {
      throw new MatchInvalidException("Tento set neexistuje.");
    }

    if (set.IsFinished)
    {
      throw new MatchInvalidException("Nelze měnit pozice v již ukončeném setu.");
    }

    var onRoster = false;
    foreach (var r in _roster)
    {
      if (r.TeamMemberId == memberId)
      {
        onRoster = true;
      }
    }

    if (!onRoster)
    {
      throw new MatchInvalidException("Hráč není na soupisce tohoto zápasu.");
    }

    set.AssignPosition(memberId, position);
  }

  public void StartMatch(ISetRules setRules)
  {
    if (Status != MatchStatus.Accepted)
    {
      throw new MatchInvalidException("Zápas nelze zahájit v aktuálním stavu.");
    }

    Status = MatchStatus.InProgress;
    _sets.Add(new MatchSet(new MatchSetId(Guid.NewGuid()), Id, 1, SetType.Standard, setRules.PointsToWinStandardSet));
  }

  public void StartCurrentSet()
  {
    if (Status != MatchStatus.InProgress)
    {
      throw new MatchInvalidException("Nelze odstartovat set, zápas neprobíhá.");
    }

    var currentSet = _sets.LastOrDefault();
    if (currentSet == null)
    {
      throw new MatchInvalidException("Nenalezen žádný set ke spuštění.");
    }

    if (currentSet.IsFinished)
    {
      throw new MatchInvalidException("Tento set je již ukončený.");
    }

    currentSet.StartSet();
  }

  public void AddPoint(SetSide side, ISetRules setRules, IMatchRules matchRules)
  {
    if (Status != MatchStatus.InProgress)
    {
      throw new MatchInvalidException("Nelze přidávat body, zápas neprobíhá.");
    }

    var currentSet = _sets.LastOrDefault();
    if (currentSet == null)
    {
      throw new MatchInvalidException("Není žádný aktivní set.");
    }

    if (!currentSet.IsStarted)
    {
      throw new MatchInvalidException("Set ještě nebyl odstartován.");
    }

    if (currentSet.IsFinished)
    {
      throw new MatchInvalidException("Nelze přidat bod do ukončeného setu.");
    }

    currentSet.AddPoint(side, setRules);

    if (currentSet.IsFinished)
    {
      CheckMatchWinner(matchRules, setRules);
    }
  }

  private void CheckMatchWinner(IMatchRules matchRules, ISetRules setRules)
  {
    int homeSets = 0;
    int awaySets = 0;

    foreach (var s in _sets)
    {
      if (s.Winner == SetWinner.Home)
      {
        homeSets++;
      }
      else if (s.Winner == SetWinner.Away)
      {
        awaySets++;
      }
    }

    if (homeSets == matchRules.SetsToWin)
    {
      Status = MatchStatus.Finished;
      WinnerId = HomeTeamId;
    }
    else if (awaySets == matchRules.SetsToWin)
    {
      Status = MatchStatus.Finished;
      WinnerId = AwayTeamId;
    }
    else
    {
      int nextSetNumber = _sets.Count + 1;
      int maxSets = (matchRules.SetsToWin * 2) - 1;

      SetType nextSetType = SetType.Standard;
      int pointsToWin = setRules.PointsToWinStandardSet;

      if (nextSetNumber == maxSets)
      {
        nextSetType = SetType.TieBreak;
        pointsToWin = setRules.PointsToWinTieBreak;
      }

      _sets.Add(new MatchSet(new MatchSetId(Guid.NewGuid()), Id, nextSetNumber, nextSetType, pointsToWin));
    }
  }

  public void CancelMatch(string reason)
  {
    if (Status == MatchStatus.Finished)
    {
      throw new MatchInvalidException("Nelze zrušit již odehraný zápas.");
    }
    Status = MatchStatus.Cancelled;
  }
}