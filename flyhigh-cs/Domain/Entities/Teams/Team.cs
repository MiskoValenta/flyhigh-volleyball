 using Domain.Common;
using Domain.Entities.Teams.Exceptions;
using Domain.Entities.Teams.TeamEnums;
using Domain.Entities.Users;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;

namespace Domain.Entities.Teams;

public class Team : AuditableEntity<TeamId>
{
  private readonly List<TeamMember> _members = new();
  public IReadOnlyCollection<TeamMember> Members => _members.AsReadOnly();

  public UserId OwnerId { get; private set; }
  public string TeamName { get; private set; }
  public string ShortName { get; private set; }
  public string? Description { get; private set; }

  private Team() { }

  private Team(
    TeamId id,
    UserId ownerId,
    string teamName,
    string shortName,
    string? description) : base(id)
  {
    OwnerId = ownerId;
    TeamName = teamName;
    ShortName = shortName;
    Description = description;
  }

  public static Team Create(
    UserId ownerId,
    string teamName,
    string shortName,
    string? description)
  {
    if (string.IsNullOrWhiteSpace(teamName))
    {
      throw new TeamNameEmptyException();
    }

    if (string.IsNullOrWhiteSpace(shortName))
    {
      throw new TeamShortNameEmptyException();
    }

    var newId = TeamId.New();

    var team = new Team(
      newId,
      ownerId,
      teamName,
      shortName,
      description);

    team._members.Add(TeamMember.CreateActiveOwner(ownerId, team.Id));

    return team;
  }

  public bool IsMember(UserId userId)
  {
    return _members.Any(m => m.UserId == userId && m.Status == TeamMemberStatus.Active);
  }

  public TeamRole? GetRole(UserId userId)
  {
    var member = _members.FirstOrDefault(m => m.UserId == userId && m.Status == TeamMemberStatus.Active);
    if (member != null)
    {
      return member.Role;
    }
    else
    {
      return null;
    }
  }

  public bool IsCoach(UserId userId)
  {
    return GetRole(userId) == TeamRole.Coach;
  }

  public int CoachesCount()
  {
    return _members.Count(m => m.Role == TeamRole.Coach && m.Status == TeamMemberStatus.Active);
  }

  public TeamMember GetMember(UserId userId)
  {
    var member = _members.FirstOrDefault(m => m.UserId == userId);
    if (member == null)
    {
      throw new TeamMemberNotFoundException(userId.Value);
    }
    return member;
  }

  public void InviteMember(UserId userId, TeamRole role)
  {
    var existingMember = _members.FirstOrDefault(m => m.UserId == userId);

    if (existingMember != null)
    {
      if (existingMember.Status == TeamMemberStatus.Pending)
      {
        throw new TeamInvalidException("Uživatel už má nevyřízenou pozvánku.");
      }

      if (existingMember.IsActive && existingMember.Status == TeamMemberStatus.Active)
      {
        throw new TeamInvalidException("Uživatel už je aktivním členem týmu.");
      }

      existingMember.Reinvite(role);
      return;
    }

    var member = TeamMember.Create(userId, Id, role, TeamMemberStatus.Pending);
    _members.Add(member);
    MarkAsModified();
  }

  public void AcceptInvitation(UserId userId)
  {
    var member = GetMember(userId);
    if (member.Status != TeamMemberStatus.Pending)
    {
      throw new TeamInvalidException("Pozvánka neexistuje nebo už byla vyřízena.");
    }

    if (member.InvitedAt.HasValue && (DateTime.UtcNow - member.InvitedAt.Value).TotalDays > 14)
    {
      throw new TeamInvalidException("Pozvánka vypršela.");
    }

    member.ChangeStatus(TeamMemberStatus.Active);
    MarkAsModified();
  }

  public void DeclineInvitation(UserId userId)
  {
    var member = GetMember(userId);
    if (member.Status != TeamMemberStatus.Pending)
    {
      throw new TeamInvalidException("Pozvánka neexistuje nebo už byla vyřízena.");
    }

    member.ChangeStatus(TeamMemberStatus.Declined);
    MarkAsModified();
  }

  public void RemoveMember(UserId userId)
  {
    var member = GetMember(userId);

    if (member.Role == TeamRole.Owner)
    {
      throw new TeamInvalidException("Jako majitel nemůžeš odejít z týmu. Musíš nejprve předat roli někomu jinému, nebo být v týmu sám a tým smazat.");
    }

    member.Deactivate();
    MarkAsModified();
  }

  public void TransferOwnership(UserId currentOwnerId, UserId newOwnerId)
  {
    if (OwnerId != currentOwnerId)
    {
      throw new TeamInvalidException("Pouze aktuální majitel může předat vlastnictví týmu.");
    }

    if (currentOwnerId == newOwnerId)
    {
      throw new TeamInvalidException("Nemůžeš předat vlastnictví sám sobě.");
    }

    var currentOwnerMember = GetMember(currentOwnerId);
    var newOwnerMember = GetMember(newOwnerId);

    if (newOwnerMember.Status != TeamMemberStatus.Active)
    {
      throw new TeamInvalidException("Novému majiteli nelze předat vlastnictví, protože není aktivním členem týmu.");
    }

    currentOwnerMember.ChangeRole(TeamRole.Coach);
    newOwnerMember.ChangeRole(TeamRole.Owner);

    OwnerId = newOwnerId;
    MarkAsModified();
  }

  public void ChangeMemberRole(UserId userId, TeamRole newRole)
  {
    var member = GetMember(userId);
    if (member.Role == newRole)
    {
      throw new InvalidOperationException("Člen už tuto roli má.");
    }

    if (member.Role == TeamRole.Owner)
    {
      throw new TeamInvalidException("Majiteli týmu nelze změnit roli klasickou cestou. Pro změnu musí předat vlastnictví.");
    }

    if (member.Status != TeamMemberStatus.Active)
    {
      throw new InvalidRoleChange();
    }

    member.ChangeRole(newRole);
    MarkAsModified();
  }

  public void DeleteTeam()
  {
    int activeMembersCount = 0;
    foreach (var member in _members)
    {
      if (member.Status == TeamMemberStatus.Active)
      {
        activeMembersCount++;
      }
    }

    if (activeMembersCount > 1)
    {
      throw new TeamInvalidException("Tým nelze smazat, dokud v něm nejsi kompletně sám. Nejprve musí odejít všichni členové.");
    }

    MarkAsDeleted();
  }

  public void UpdateDetails(string teamName, string shortName, string description)
  {
    TeamName = teamName;
    ShortName = shortName;
    Description = description;
  }
}