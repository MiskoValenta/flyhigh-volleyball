using Domain.Common;
using Domain.Entities.Matches.MatchEnums;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public class MatchPlayerPosition : Entity<MatchPlayerPositionId>
{
  public MatchSetId MatchSetId { get; private set; }
  public TeamMemberId TeamMemberId { get; private set; }
  public PlayerPosition Position { get; private set; }

  private MatchPlayerPosition() { }

  internal MatchPlayerPosition(MatchPlayerPositionId id, MatchSetId matchSetId, TeamMemberId teamMemberId, PlayerPosition position) : base(id)
  {
    MatchSetId = matchSetId;
    TeamMemberId = teamMemberId;
    Position = position;
  }

  internal void UpdatePosition(PlayerPosition newPosition)
  {
    Position = newPosition;
  }
}