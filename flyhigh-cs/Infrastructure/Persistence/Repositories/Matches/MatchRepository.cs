using Domain.Entities.Matches;
using Domain.Entities.Matches.MatchEnums;
using Domain.Repositories.Matches;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Repositories.Matches;

public class MatchRepository : IMatchRepository
{
  private readonly FlyHighDbContext _context;

  public MatchRepository(FlyHighDbContext context)
  {
    _context = context;
  }

  public async Task<Match?> GetByIdAsync(MatchId id, CancellationToken cancellationToken = default)
  {
    return await _context.Matches
        .Include(m => m.Roster)
        .Include(m => m.Sets)
            .ThenInclude(s => s.PlayerPositions)
        .SingleOrDefaultAsync(m => m.Id == id, cancellationToken);
  }

  public async Task<List<Match>> GetAllAsync(CancellationToken cancellationToken = default)
  {
    return await _context.Matches
        .Include(m => m.Roster)
        .Include(m => m.Sets)
            .ThenInclude(s => s.PlayerPositions)
        .ToListAsync(cancellationToken);
  }

  public async Task<List<Match>> GetMatchesByTeamIdAsync(TeamId teamId, CancellationToken cancellationToken = default)
  {
    return await _context.Matches
        .Include(m => m.Roster)
        .Include(m => m.Sets)
            .ThenInclude(s => s.PlayerPositions)
        .Where(m => m.HomeTeamId == teamId || m.AwayTeamId == teamId)
        .ToListAsync(cancellationToken);
  }

  public async Task AddAsync(Match match, CancellationToken cancellationToken = default)
  {
    await _context.Matches.AddAsync(match, cancellationToken);
  }

  public void Update(Match match)
  {
    _context.Matches.Update(match);
  }

  public void Remove(Match match)
  {
    _context.Matches.Remove(match);
  }

  public async Task<int> GetPlayedMatchesCountByUserAsync(UserId userId, CancellationToken cancellationToken = default)
  {
    return await _context.Matches
        .Where(m => m.Status == MatchStatus.Finished && m.Roster.Any(r => r.UserId == userId))
        .CountAsync(cancellationToken);
  }

  public async Task<int> GetPlayedMatchesCountByTeamAsync(TeamId teamId, CancellationToken cancellationToken = default)
  {
    return await _context.Matches
        .Where(m => m.Status == MatchStatus.Finished && (m.HomeTeamId == teamId || m.AwayTeamId == teamId))
        .CountAsync(cancellationToken);
  }
}
