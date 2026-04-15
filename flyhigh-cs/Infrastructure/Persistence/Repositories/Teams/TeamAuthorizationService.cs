using Application.Interfaces.Teams;
using Domain.Entities.Teams;
using Domain.Entities.Teams.TeamEnums;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Teams;

public class TeamAuthorizationService : ITeamAuthorizationService
{
  private readonly FlyHighDbContext _context;

  public TeamAuthorizationService(FlyHighDbContext context)
  {
    _context = context;
  }

  public async Task<bool> HasRoleInTeamAsync(Guid userId, Guid teamId, params TeamRole[] requiredRoles)
  {
    var uId = new UserId(userId);
    var tId = new TeamId(teamId);

    var member = await _context.TeamMembers
      .FirstOrDefaultAsync(m => m.UserId == uId && m.TeamId == tId && m.IsActive);

    if (member == null) return false;

    return requiredRoles.Contains(member.Role);
  }

  public async Task<bool> IsOwnerAsync(UserId userId, TeamId teamId, CancellationToken cancellationToken = default)
  {
    return await _context.TeamMembers
        .AnyAsync(tm => tm.TeamId == teamId
                     && tm.UserId == userId
                     && tm.Role == TeamRole.Owner
                     && tm.Status == TeamMemberStatus.Active, cancellationToken);
  }

  public async Task<bool> IsAtLeastCoachAsync(UserId userId, TeamId teamId, CancellationToken cancellationToken = default)
  {
    return await _context.TeamMembers
        .AnyAsync(tm => tm.TeamId == teamId
                     && tm.UserId == userId
                     && (tm.Role == TeamRole.Owner || tm.Role == TeamRole.Coach)
                     && tm.Status == TeamMemberStatus.Active, cancellationToken);
  }

  public async Task<bool> IsMemberAsync(UserId userId, TeamId teamId, CancellationToken cancellationToken = default)
  {
    return await _context.TeamMembers
        .AnyAsync(tm => tm.TeamId == teamId
                     && tm.UserId == userId
                     && tm.Status == TeamMemberStatus.Active, cancellationToken);
  }
}
