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

public sealed class MatchSet : Entity<MatchSetId>
{
  public MatchId MatchId { get; private set; }
  public int SetNumber { get; private set; }
  public int HomeTeamScore { get; private set; }
  public int AwayTeamScore { get; private set; }
  public bool IsCompleted { get; private set; }
  public TeamId? WinnerTeamId { get; private set; }

  private readonly List<MatchPlayerPosition> _playerPositions = new();
  public IReadOnlyCollection<MatchPlayerPosition> PlayerPositions => _playerPositions.AsReadOnly();

  private MatchSet() { }

  private MatchSet(
    MatchSetId id,
    MatchId matchId, 
    int setNumber, 
    IEnumerable<(TeamId TeamId, UserId UserId, PlayerPosition Position)> setups)
      : base(id)
  {
    MatchId = matchId;
    SetNumber = setNumber;
    HomeTeamScore = 0;
    AwayTeamScore = 0;
    IsCompleted = false;

    foreach (var setup in setups)
    {
      _playerPositions.Add(MatchPlayerPosition.Create(Id, setup.TeamId, setup.UserId, setup.Position));
    }
  }

  public static MatchSet Create(
    MatchId matchId, 
    int setNumber, 
    IEnumerable<(TeamId TeamId, UserId UserId, PlayerPosition Position)> setups)
  {
    var newId = MatchSetId.New();
    var matchSet = new MatchSet(
      newId,
      matchId,
      setNumber,
      setups);

    return matchSet;
  }

  public void RecordPoint(TeamId scoringTeamId, TeamId homeTeamId, TeamId awayTeamId)
  {
    if (IsCompleted)
      throw new MatchInvalidException("Tento set již skončil, nelze přidávat body.");

    if (scoringTeamId == homeTeamId)
      HomeTeamScore++;
    else if (scoringTeamId == awayTeamId)
      AwayTeamScore++;
    else
      throw new MatchInvalidException("Tým není součástí tohoto zápasu.");

    if (VolleyballSetRules.IsSetFinished(HomeTeamScore, AwayTeamScore, SetNumber))
    {
      IsCompleted = true;
      WinnerTeamId = HomeTeamScore > AwayTeamScore ? homeTeamId : awayTeamId;
    }
  }
}