using Domain.Common;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public sealed class MatchRosterEntry : Entity<MatchRosterEntryId>
{
  public MatchId MatchId { get; private set; }
  public TeamId TeamId { get; private set; }
  public UserId UserId { get; private set; }
  public int JerseyNumber { get; private set; }

  private MatchRosterEntry() { }

  private MatchRosterEntry(
    MatchRosterEntryId id, 
    MatchId matchId, 
    TeamId teamId, 
    UserId userId, 
    int jerseyNumber)
      : base(id)
  {
    MatchId = matchId;
    TeamId = teamId;
    UserId = userId;
    JerseyNumber = jerseyNumber;
  }

  public static MatchRosterEntry Create(MatchId matchId, TeamId teamId, UserId userId, int jerseyNumber)
  {
    var newId = MatchRosterEntryId.New();

    var matchRosterEntry = new MatchRosterEntry(
      newId,
      matchId,
      teamId,
      userId,
      jerseyNumber);

    return matchRosterEntry;
  }
}
