using Domain.Common;
using Domain.Entities.Matches.MatchEnums;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public sealed class MatchPlayerPosition : Entity<MatchPlayerPositionId>
{
  public MatchSetId MatchSetId { get; private set; }
  public TeamId TeamId { get; private set; }
  public UserId UserId { get; private set; }
  public PlayerPosition Position { get; private set; }

  private MatchPlayerPosition() { }

  private MatchPlayerPosition(
    MatchPlayerPositionId id,
    MatchSetId matchSetId, 
    TeamId teamId, 
    UserId userId, 
    PlayerPosition position)
      : base(id)
  {
    MatchSetId = matchSetId;
    TeamId = teamId;
    UserId = userId;
    Position = position;
  }

  public static MatchPlayerPosition Create(
    MatchSetId matchSetId, 
    TeamId teamId, 
    UserId userId, 
    PlayerPosition position)
  {
    var newId = MatchPlayerPositionId.New();

    var matchPlayerPosition = new MatchPlayerPosition(
      newId,
      matchSetId,
      teamId,
      userId,
      position
      );

    return matchPlayerPosition;
  }
}
