using Domain.Entities.Matches;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Teams;
using Domain.Repositories.Matches;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories.Matches;

public class MatchRepository : IMatchRepository
{
  private readonly FlyHighDbContext _context;

  public MatchRepository(FlyHighDbContext context)
  {
    _context = context;
  }

  public async Task AddAsync(Match match, CancellationToken cancellationToken = default)
  {
    await _context.Set<Match>().AddAsync(match, cancellationToken);
  }

  public async Task<Match?> GetByIdAsync(MatchId id, CancellationToken cancellationToken = default)
  {

    return await _context.Set<Match>()
        .Include(m => m.Roster)
        .Include(m => m.Sets)
        .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
  }

  public void Update(Match match)
  {

    _context.Set<Match>().Update(match);
  }

  public async Task<IEnumerable<Match>> GetMatchesByTeamIdsAsync(IEnumerable<TeamId> teamIds, CancellationToken cancellationToken = default)
  {
    return await _context.Set<Match>()
        .Where(m => teamIds.Contains(m.HomeTeamId) || teamIds.Contains(m.AwayTeamId))
        .OrderBy(m => m.ScheduledAt)
        .ToListAsync(cancellationToken);
  }

  public async Task<int> GetPlayedMatchesCountByTeamAsync(TeamId teamId, CancellationToken cancellationToken = default)
  {
    return await _context.Set<Match>()
        .CountAsync(m => (m.HomeTeamId == teamId || m.AwayTeamId == teamId) && m.Status == MatchStatus.Finished, cancellationToken);
  }

  public async Task<int> GetPlayedMatchesCountByUserAsync(UserId userId, CancellationToken cancellationToken = default)
  {
    return await _context.Set<Match>()
        .CountAsync(m => m.Status == MatchStatus.Finished &&
                         _context.Set<TeamMember>().Any(tm => tm.UserId == userId && m.Roster.Any(r => r.TeamMemberId == tm.Id)),
                    cancellationToken);
  }
}
