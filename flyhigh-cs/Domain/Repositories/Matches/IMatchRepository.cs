using Domain.Entities.Matches;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Repositories.Matches;

public interface IMatchRepository
{
  Task<Match?> GetByIdAsync(MatchId id, CancellationToken cancellationToken = default);
  Task AddAsync(Match match, CancellationToken cancellationToken = default);
  void Update(Match match);
  Task<IEnumerable<Match>> GetMatchesByTeamIdsAsync(IEnumerable<Domain.Value_Objects.Teams.TeamId> teamIds, CancellationToken cancellationToken = default);
  Task<int> GetPlayedMatchesCountByTeamAsync(TeamId teamId, CancellationToken cancellationToken = default);
  Task<int> GetPlayedMatchesCountByUserAsync(UserId userId, CancellationToken cancellationToken = default);
}
