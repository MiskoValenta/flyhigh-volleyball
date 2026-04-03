using Domain.Common;
using Domain.Entities.Matches.Exceptions;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Matches.Rules;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public class MatchSet : Entity<MatchSetId>
{
  public MatchId MatchId { get; private set; }
  public int SetNumber { get; private set; }
  public SetType Type { get; private set; }
  public int HomeScore { get; private set; }
  public int AwayScore { get; private set; }
  public bool IsFinished { get; private set; }
  public bool IsStarted { get; private set; }
  public SetWinner Winner { get; private set; }

  private readonly List<MatchPlayerPosition> _positions = new();
  public IReadOnlyCollection<MatchPlayerPosition> Positions => _positions.AsReadOnly();

  private readonly int _targetPoints;

  private MatchSet() { }

  internal MatchSet(MatchSetId id, MatchId matchId, int setNumber, SetType type, int targetPoints) : base(id)
  {
    MatchId = matchId;
    SetNumber = setNumber;
    Type = type;
    HomeScore = 0;
    AwayScore = 0;
    IsFinished = false;
    IsStarted = false;
    Winner = SetWinner.None;
    _targetPoints = targetPoints;
  }

  internal void StartSet()
  {
    if (IsStarted)
    {
      throw new MatchInvalidException("Set byl již spuštěn.");
    }
    IsStarted = true;
  }

  internal void AddPoint(SetSide side, ISetRules rules)
  {
    if (IsFinished)
    {
      throw new MatchInvalidException("Tento set je již u konce.");
    }

    if (!IsStarted)
    {
      throw new MatchInvalidException("Set ještě nezačal.");
    }

    if (side == SetSide.Home)
    {
      HomeScore++;
    }
    else
    {
      AwayScore++;
    }

    CheckSetWinner(rules);
  }

  internal void AssignPosition(TeamMemberId memberId, PlayerPosition position)
  {
    var existingPos = _positions.FirstOrDefault(p => p.TeamMemberId == memberId);
    if (existingPos != null)
    {
      existingPos.UpdatePosition(position);
    }
    else
    {
      _positions.Add(new MatchPlayerPosition(new MatchPlayerPositionId(Guid.NewGuid()), Id, memberId, position));
    }
  }

  private void CheckSetWinner(ISetRules rules)
  {
    if (HomeScore >= _targetPoints)
    {
      if (HomeScore - AwayScore >= rules.PointDifferenceRequired)
      {
        IsFinished = true;
        Winner = SetWinner.Home;
      }
    }
    else if (AwayScore >= _targetPoints)
    {
      if (AwayScore - HomeScore >= rules.PointDifferenceRequired)
      {
        IsFinished = true;
        Winner = SetWinner.Away;
      }
    }
  }
}