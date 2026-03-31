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

public class Match : AuditableEntity<MatchId>
{
  private readonly List<MatchSet> _sets = new();
  private readonly List<MatchRosterEntry> _roster = new();

  public UserId CreatorId { get; private set; }
  public TeamId HomeTeamId { get; private set; }
  public TeamId AwayTeamId { get; private set; }
  public string Location { get; private set; }

  public DateTime ScheduledAt { get; private set; }
  public UserId? RefereeId { get; private set; }
  public string? Notes { get; private set; }
  public MatchStatus Status { get; private set; }
  public TeamId? WinnerId { get; private set; }

  public IReadOnlyCollection<MatchSet> Sets => _sets.AsReadOnly();
  public IReadOnlyCollection<MatchRosterEntry> Roster => _roster.AsReadOnly();

  private Match() { }

  private Match(
      MatchId id,
      UserId creatorId,
      TeamId homeTeamId,
      TeamId awayTeamId,
      DateTime scheduledAt,
      string location,
      UserId? refereeId) : base(id)
  {
    if (string.IsNullOrWhiteSpace(location))
    {
      throw new ArgumentException("Lokace nesmí být prázdná.", nameof(location));
    }

    CreatorId = creatorId;
    HomeTeamId = homeTeamId;
    AwayTeamId = awayTeamId;
    ScheduledAt = scheduledAt;
    Location = location;
    RefereeId = refereeId;

    Status = MatchStatus.Proposed;
  }

  public static Match CreateInvitation(
      UserId creatorId,
      TeamId homeTeamId,
      TeamId awayTeamId,
      DateTime scheduledAt,
      string location,
      UserId? refereeId)
  {
    if (homeTeamId == awayTeamId)
    {
      throw new MatchInvalidException("Domácí a hostující tým musí být odlišný.");
    }

    var newId = MatchId.New();

    return new Match(
        newId,
        creatorId,
        homeTeamId,
        awayTeamId,
        scheduledAt,
        location,
        refereeId);
  }

  public void AcceptInvitation()
  {
    if (Status != MatchStatus.Proposed)
    {
      throw new MatchInvalidException("Pouze navržený zápas může být přijat.");
    }

    Status = MatchStatus.Accepted;
    MarkAsModified();
  }

  public void RejectInvitation()
  {
    if (Status != MatchStatus.Proposed)
    {
      throw new InvalidOperationException("Pouze navržený zápas může být odmítnut.");
    }

    Status = MatchStatus.Rejected;
    MarkAsModified();
  }

  public void SetReferee(UserId refereeId)
  {
    if (Status == MatchStatus.Finished || Status == MatchStatus.Cancelled)
    {
      throw new MatchInvalidException("Nelze měnit rozhodčího u ukončeného nebo zrušeného zápasu.");
    }

    RefereeId = refereeId;
    MarkAsModified();
  }

  public void AddToRoster(TeamMemberId teamMemberId, TeamId teamId, int jerseyNumber)
  {
    if (Status == MatchStatus.Finished || Status == MatchStatus.Cancelled)
    {
      throw new MatchInvalidException("Nelze měnit soupisku u ukončeného zápasu.");
    }

    if (teamId != HomeTeamId && teamId != AwayTeamId)
    {
      throw new MatchInvalidException("Tým nehraje v tomto zápase.");
    }

    if (_roster.Any(x => x.TeamMemberId == teamMemberId))
    {
      throw new MatchInvalidException("Hráč již je zapsaný na soupisce pro tento zápas.");
    }

    if (_roster.Any(x => x.TeamId == teamId && x.JerseyNumber == jerseyNumber))
    {
      throw new InvalidOperationException($"Číslo dresu {jerseyNumber} je v tomto týmu už zabrané.");
    }

    _roster.Add(MatchRosterEntry.Create(
      Id, teamMemberId,
      teamId,
      jerseyNumber));

    MarkAsModified();
  }

  public void StartMatch(ISetRules setRules)
  {
    if (Status != MatchStatus.Accepted && Status != MatchStatus.Scheduled)
    {
      throw new MatchInvalidException("Zápas musí být přijatý, aby mohl být zahájen.");
    }

    ValidateRoster();
    Status = MatchStatus.InProgress;

    _sets.Add(MatchSet.Create(1, SetType.Normal));
    MarkAsModified();
  }

  public void StartCurrentSet()
  {
    if (Status != MatchStatus.InProgress)
    {
      throw new MatchInvalidException("Zápas není rozehrán.");
    }

    var currentSet = _sets.OrderBy(s => s.SetNumber).LastOrDefault();
    if (currentSet == null)
    {
      throw new InvalidOperationException("Neexistuje žádný set.");
    }

    currentSet.StartSet();
    MarkAsModified();
  }

  public void AssignPlayerPositionForSet(int setNumber, TeamMemberId teamMemberId, PlayerPosition position)
  {
    if (Status != MatchStatus.InProgress && Status != MatchStatus.Scheduled && Status != MatchStatus.Accepted)
    {
      throw new MatchInvalidException("Pozice lze měnit pouze před nebo během zápasu.");
    }

    var set = _sets.SingleOrDefault(s => s.SetNumber == setNumber);
    if (set == null)
    {
      throw new InvalidOperationException($"Set {setNumber} neexistuje.");
    }

    if (!_roster.Any(r => r.TeamMemberId == teamMemberId))
    {
      throw new MatchInvalidException("Hráč musí být nejprve na soupisce zápasu, než mu bude přidělena pozice.");
    }

    set.AssignPlayerPosition(teamMemberId, position);
    MarkAsModified();
  }

  public void AddPoint(SetSide side, ISetRules setRules, IMatchRules matchRules)
  {
    if (Status != MatchStatus.InProgress)
    {
      throw new MatchInvalidException("Zápas aktuálně neprobíhá.");
    }

    var currentSet = _sets.OrderBy(s => s.SetNumber).LastOrDefault();
    if (currentSet == null)
    {
      throw new InvalidOperationException("Neexistuje žádný set.");
    }

    currentSet.AddPoint(side, setRules);

    if (currentSet.IsFinished)
    {
      HandleFinishedSet(setRules, matchRules);
    }

    MarkAsModified();
  }

  private void HandleFinishedSet(ISetRules setRules, IMatchRules matchRules)
  {
    if (matchRules.IsMatchFinished(_sets))
    {
      Status = MatchStatus.Finished;

      int homeWins = _sets.Count(s => s.Winner == SetWinner.Home);
      int awayWins = _sets.Count(s => s.Winner == SetWinner.Away);

      if (homeWins > awayWins)
      {
        WinnerId = HomeTeamId;
      }
      else
      {
        WinnerId = AwayTeamId;
      }

      return;
    }

    int currentHomeWins = _sets.Count(s => s.Winner == SetWinner.Home);
    int currentAwayWins = _sets.Count(s => s.Winner == SetWinner.Away);

    bool isTieBreak = false;
    if (currentHomeWins == 2 && currentAwayWins == 2)
    {
      isTieBreak = true;
    }

    SetType nextType;
    if (isTieBreak)
    {
      nextType = SetType.TieBreak;
    }
    else
    {
      nextType = SetType.Normal;
    }

    _sets.Add(MatchSet.Create(
        _sets.Count + 1,
        nextType
    ));
  }

  public void CancelMatch(string cancellationReason)
  {
    if (Status == MatchStatus.Finished || Status == MatchStatus.Rejected)
    {
      throw new MatchInvalidException("Nelze zrušit zápas, který už je dohraný nebo odmítnutý.");
    }

    Status = MatchStatus.Cancelled;

    if (string.IsNullOrWhiteSpace(Notes))
    {
      Notes = cancellationReason;
    }
    else
    {
      Notes = $"{Notes} | Důvod zrušení: {cancellationReason}";
    }

    MarkAsDeleted();
  }

  private void ValidateRoster()
  {
    int homeCount = _roster.Count(x => x.TeamId == HomeTeamId);
    int awayCount = _roster.Count(x => x.TeamId == AwayTeamId);

    if (homeCount < 6 || awayCount < 6)
    {
      throw new MatchInvalidException("Oba týmy musí mít na soupisce alespoň 6 hráčů před začátkem zápasu.");
    }
  }
}