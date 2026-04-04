using Application.Common.Interfaces;
using Application.DTOs.Teams;
using Application.Interfaces.Teams;
using Domain.Entities.Teams;
using Domain.Entities.Teams.TeamEnums;
using Domain.Repositories.Matches;
using Domain.Repositories.Teams;
using Domain.Repositories.Users;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Diagnostics.Tracing;
using System.Text;

namespace Application.Services.Teams;

public class TeamService : ITeamService
{
  private readonly ITeamRepository _teamRepository;
  private readonly IUserRepository _userRepository;
  private readonly ITeamAuthorizationService _auth;
  private readonly IUnitOfWork _unitOfWork;
  private readonly IMatchRepository _matchRepository;

  public TeamService(
      ITeamRepository teamRepository,
      IUserRepository userRepository,
      ITeamAuthorizationService auth,
      IUnitOfWork unitOfWork,
      IMatchRepository matchRepository)
  {
    _teamRepository = teamRepository;
    _userRepository = userRepository;
    _auth = auth;
    _unitOfWork = unitOfWork;
    _matchRepository = matchRepository;
  }

  public async Task<Guid> CreateTeamAsync(CreateTeamDto dto, Guid currentUserId)
  {
    var ownerId = new UserId(currentUserId);
    var team = Team.Create(ownerId, dto.TeamName, dto.ShortName, dto.Description);

    await _teamRepository.AddAsync(team);
    await _teamRepository.SaveChangesAsync();

    return team.Id.Value;
  }

  public async Task<List<TeamResponseDto>> GetUserTeamsAsync(Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var userId = new UserId(currentUserId);

    var teams = await _teamRepository.GetUserTeamsAsync(userId, cancellationToken);

    return teams
        .Where(t =>
        {
          var member = t.Members.FirstOrDefault(m => m.UserId == userId);
          if (member != null)
          {
            if (member.IsActive && member.Status == TeamMemberStatus.Active)
            {
              return true;
            }
            else
            {
              return false;
            }
          }
          else
          {
            return false;
          }
        })
        .Select(t =>
        {
          string roleStr;
          var role = t.GetRole(userId);
          if (role != null)
          {
            roleStr = role.ToString();
          }
          else
          {
            roleStr = "Unknown";
          }
          int playerCount = t.Members.Count(m => m.Status == TeamMemberStatus.Active);

          return new TeamResponseDto(
              t.Id.Value,
              t.TeamName,
              t.ShortName,
              roleStr,
              t.GetMember(userId).Status.ToString(),
              playerCount
          );
        }).ToList();
  }

  public async Task<TeamDetailDto> GetTeamByIdAsync(Guid teamId, Guid currentUserId)
  {
    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId));
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    string currentUserRole;
    var role = team.GetRole(new UserId(currentUserId));
    if (role != null)
    {
      currentUserRole = role.ToString();
    }
    else
    {
      currentUserRole = "Unknown";
    }

    var memberDtos = new List<TeamMemberDto>();
    foreach (var member in team.Members)
    {
      if (!member.IsActive || member.Status != TeamMemberStatus.Active)
      {
        continue;
      }

      var user = await _userRepository.GetByIdAsync(member.UserId);
      if (user != null)
      {
        memberDtos.Add(new TeamMemberDto(
            user.Id.Value,
            user.Email,
            user.FirstName,
            user.LastName,
            member.Role.ToString(),
            member.IsActive
        ));
      }
    }

    return new TeamDetailDto(
        team.Id.Value,
        team.TeamName,
        team.ShortName,
        team.Description,
        currentUserRole,
        memberDtos
    );
  }

  public async Task DeleteTeamAsync(Guid teamId, Guid actorId)
  {
    bool isAuthorized = await _auth.HasRoleInTeamAsync(actorId, teamId, TeamRole.Owner);
    if (!isAuthorized)
    {
      throw new UnauthorizedAccessException("Pouze majitel může smazat tým.");
    }

    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId));
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    team.DeleteTeam();
    await _teamRepository.SaveChangesAsync();
  }

  public async Task InviteMemberAsync(Guid teamId, Guid actorId, AddMemberDto dto)
  {
    bool isAuthorized = await _auth.HasRoleInTeamAsync(actorId, teamId, TeamRole.Owner, TeamRole.Coach);
    if (!isAuthorized)
    {
      throw new UnauthorizedAccessException("Nemáš oprávnění přidávat/zvát členy do tohoto týmu.");
    }

    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId));
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    var targetUser = await _userRepository.GetByIdAsync(new UserId(dto.TargetId));
    if (targetUser == null)
    {
      throw new KeyNotFoundException("Uživatel, kterého se snažíš přidat, neexistuje.");
    }

    team.InviteMember(targetUser.Id, dto.SetRole);

    await _teamRepository.SaveChangesAsync();
  }

  public async Task AcceptInvitationAsync(Guid teamId, Guid currentUserId)
  {
    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId));
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    team.AcceptInvitation(new UserId(currentUserId));
    await _teamRepository.SaveChangesAsync();
  }

  public async Task DeclineInvitationAsync(Guid teamId, Guid currentUserId)
  {
    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId));
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    team.DeclineInvitation(new UserId(currentUserId));
    await _teamRepository.SaveChangesAsync();
  }

  public async Task<IEnumerable<PendingInvitationDto>> GetPendingInvitationsAsync(Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var userId = new UserId(currentUserId);
    var teams = await _teamRepository.GetPendingInvitationsAsync(userId, cancellationToken);

    var dtos = new List<PendingInvitationDto>();
    foreach (var team in teams)
    {
      var memberInfo = team.Members.FirstOrDefault(m => m.UserId == userId);

      string roleStr;
      if (memberInfo != null)
      {
        roleStr = memberInfo.Role.ToString();
      }
      else
      {
        roleStr = "Hráč";
      }

      dtos.Add(new PendingInvitationDto(
          team.Id.Value,
          team.TeamName,
          roleStr,
          team.CreatedAt
      ));
    }

    return dtos;
  }

  public async Task RemoveMemberAsync(Guid teamId, Guid actorId, Guid targetMemberId)
  {
    bool isSelfRemoval = false;
    if (actorId == targetMemberId)
    {
      isSelfRemoval = true;
    }

    bool isManager = await _auth.HasRoleInTeamAsync(actorId, teamId, TeamRole.Owner, TeamRole.Coach);

    if (!isSelfRemoval && !isManager)
    {
      throw new UnauthorizedAccessException("Nemáš oprávnění odebírat členy z tohoto týmu.");
    }

    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId));
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    team.RemoveMember(new UserId(targetMemberId));

    await _teamRepository.SaveChangesAsync();
  }

  public async Task PromoteMemberAsync(Guid teamId, Guid actorId, Guid targetMemberId, ChangeRoleDto dto)
  {
    var isOwner = await _auth.HasRoleInTeamAsync(actorId, teamId, TeamRole.Owner);
    var isCoach = await _auth.HasRoleInTeamAsync(actorId, teamId, TeamRole.Coach);

    if (!isOwner && !isCoach)
    {
      throw new UnauthorizedAccessException("Nemáš oprávnění měnit role v tomto týmu.");
    }

    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId));
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    if (dto.NewRole == TeamRole.Owner)
    {
      if (!isOwner)
      {
        throw new UnauthorizedAccessException("Pouze aktuální majitel může předat své vlastnictví.");
      }

      team.TransferOwnership(new UserId(actorId), new UserId(targetMemberId));
    }
    else
    {
      if (isCoach && !isOwner)
      {
        var targetMember = team.GetMember(new UserId(targetMemberId));
        if (targetMember.Role == TeamRole.Owner || targetMember.Role == TeamRole.Coach)
        {
          throw new UnauthorizedAccessException("Trenér nemůže měnit roli majiteli ani jiným trenérům.");
        }
      }

      team.ChangeMemberRole(new UserId(targetMemberId), dto.NewRole);
    }

    await _teamRepository.SaveChangesAsync();
  }

  public async Task UpdateTeamAsync(Guid teamId, UpdateTeamDto dto, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var team = await _teamRepository.GetByIdAsync(new TeamId(teamId), cancellationToken);
    if (team == null)
    {
      throw new Exception("Tým nenalezen.");
    }

    var member = team.Members.FirstOrDefault(m => m.UserId.Value == currentUserId);
    if (member == null)
    {
      throw new Exception("Nemáte oprávnění upravovat tento tým.");
    }
    else
    {
      if (member.Role != TeamRole.Owner && member.Role != TeamRole.Coach)
      {
        throw new Exception("Nemáte oprávnění upravovat tento tým.");
      }
    }

    team.UpdateDetails(dto.TeamName, dto.Abbreviation, dto.Description);

    await _teamRepository.UpdateAsync(team, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task<int> GetPlayedMatchesCountAsync(Guid teamId, CancellationToken cancellationToken = default)
  {
    return await _matchRepository.GetPlayedMatchesCountByTeamAsync(new TeamId(teamId), cancellationToken);
  }
}