using Application.Common.Interfaces;
using Application.DTOs.Events;
using Application.Interfaces.Events;
using Domain.Entities.Events;
using Domain.Repositories.Events;
using Domain.Repositories.Teams;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Events;

public class EventService : IEventService
{
  private readonly IEventRepository _eventRepository;
  private readonly ITeamRepository _teamRepository;
  private readonly IUnitOfWork _unitOfWork;

  public EventService(IEventRepository eventRepository, ITeamRepository teamRepository, IUnitOfWork unitOfWork)
  {
    _eventRepository = eventRepository;
    _teamRepository = teamRepository;
    _unitOfWork = unitOfWork;
  }

  public async Task<Guid> CreateEventAsync(CreateEventDto dto, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var teamId = new TeamId(dto.TeamId);
    var creatorUserId = new UserId(currentUserId);

    var team = await _teamRepository.GetByIdAsync(teamId, cancellationToken);
    if (team == null)
    {
      throw new KeyNotFoundException("Tým nebyl nalezen.");
    }

    var member = team.Members.FirstOrDefault(m => m.UserId == creatorUserId);
    if (member == null || (member.Role != Domain.Entities.Teams.TeamEnums.TeamRole.Owner && member.Role != Domain.Entities.Teams.TeamEnums.TeamRole.Coach))
    {
      throw new UnauthorizedAccessException("Nemáte právo vytvořit událost v tomto týmu.");
    }

    var newEvent = new Event(
        new EventId(Guid.NewGuid()),
        teamId,
        creatorUserId,
        dto.Title,
        dto.Description,
        dto.Type,
        dto.EventDate,
        dto.Location
    );

    if (dto.InvitedUserIds != null && dto.InvitedUserIds.Any())
    {
      foreach (var userId in dto.InvitedUserIds)
      {
        newEvent.AddParticipant(new UserId(userId));
      }
    }
    else
    {
      foreach (var teamMember in team.Members)
      {
        newEvent.AddParticipant(teamMember.UserId);
      }
    }

    await _eventRepository.AddAsync(newEvent, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return newEvent.Id.Value;
  }

  public async Task RespondToEventAsync(Guid eventId, Guid currentUserId, RespondToEventDto dto, CancellationToken cancellationToken = default)
  {
    var teamEvent = await _eventRepository.GetByIdAsync(new EventId(eventId), cancellationToken);
    if (teamEvent == null)
    {
      throw new KeyNotFoundException("Událost nebyla nalezena.");
    }

    var team = await _teamRepository.GetByIdAsync(teamEvent.TeamId, cancellationToken);
    var member = team?.Members.FirstOrDefault(m => m.UserId == new UserId(currentUserId));

    if (member == null || !member.IsActive || member.Status != Domain.Entities.Teams.TeamEnums.TeamMemberStatus.Active)
    {
      throw new UnauthorizedAccessException("Pouze aktivní členové týmu mohou odpovídat na události.");
    }

    var participantExists = teamEvent.Participants.Any(p => p.UserId == new UserId(currentUserId));
    if (!participantExists)
    {
      teamEvent.AddParticipant(new UserId(currentUserId));
    }

    teamEvent.RespondToEvent(new UserId(currentUserId), dto.Response);

    await _eventRepository.SaveChangesAsync(cancellationToken);
  }

  public async Task<IEnumerable<EventDto>> GetTeamEventsAsync(Guid teamId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var events = await _eventRepository.GetTeamEventsAsync(new TeamId(teamId), cancellationToken);
    var userId = new UserId(currentUserId);

    return events.Select(e => {
      string myResponse;
      var participant = e.Participants.FirstOrDefault(p => p.UserId == userId);
      if (participant != null)
      {
        myResponse = participant.Response.ToString();
      }
      else
      {
        myResponse = "Unknown";
      }

      int acceptedCount = e.Participants.Count(p => p.Response == Domain.Entities.Events.EventEnums.EventResponse.Accepted);
      int declinedCount = e.Participants.Count(p => p.Response == Domain.Entities.Events.EventEnums.EventResponse.Declined);

      var participantsList = e.Participants.Select(p => new EventParticipantDto(
          p.UserId.Value,
          p.Response
      )).ToList();

      string descriptionStr;
      if (e.Description != null)
      {
        descriptionStr = e.Description;
      }
      else
      {
        descriptionStr = string.Empty;
      }

      string locationStr;
      if (e.Location != null)
      {
        locationStr = e.Location;
      }
      else
      {
        locationStr = string.Empty;
      }

      return new EventDto(
          e.Id.Value,
          e.TeamId.Value,
          e.CreatorId.Value,
          e.Title,
          descriptionStr,
          e.Type,
          e.EventDate,
          locationStr,
          e.CreatedAt,
          participantsList,
          myResponse,
          acceptedCount,
          declinedCount
      );
    });
  }

  public async Task<EventDto> GetEventByIdAsync(Guid eventId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var eId = new EventId(eventId);
    var uId = new UserId(currentUserId);

    var teamEvent = await _eventRepository.GetByIdAsync(eId, cancellationToken);
    if (teamEvent == null)
    {
      throw new KeyNotFoundException("Událost nebyla nalezena.");
    }

    var team = await _teamRepository.GetByIdAsync(teamEvent.TeamId, cancellationToken);
    if (team == null || !team.Members.Any(m => m.UserId == uId))
    {
      throw new UnauthorizedAccessException("Nejste členem tohoto týmu.");
    }

    string myResponse;
    var participant = teamEvent.Participants.FirstOrDefault(p => p.UserId == uId);
    if (participant != null)
    {
      myResponse = participant.Response.ToString();
    }
    else
    {
      myResponse = "Unknown";
    }

    int acceptedCount = teamEvent.Participants.Count(p => p.Response == Domain.Entities.Events.EventEnums.EventResponse.Accepted);
    int declinedCount = teamEvent.Participants.Count(p => p.Response == Domain.Entities.Events.EventEnums.EventResponse.Declined);

    var participantsList = teamEvent.Participants.Select(p => new EventParticipantDto(
        p.UserId.Value,
        p.Response
    )).ToList();

    string descriptionStr;
    if (teamEvent.Description != null)
    {
      descriptionStr = teamEvent.Description;
    }
    else
    {
      descriptionStr = string.Empty;
    }

    string locationStr;
    if (teamEvent.Location != null)
    {
      locationStr = teamEvent.Location;
    }
    else
    {
      locationStr = string.Empty;
    }

    return new EventDto(
        teamEvent.Id.Value,
        teamEvent.TeamId.Value,
        teamEvent.CreatorId.Value,
        teamEvent.Title,
        descriptionStr,
        teamEvent.Type,
        teamEvent.EventDate,
        locationStr,
        teamEvent.CreatedAt,
        participantsList,
        myResponse,
        acceptedCount,
        declinedCount
    );
  }

  public async Task DeleteEventAsync(Guid eventId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var eId = new EventId(eventId);
    var userId = new UserId(currentUserId);

    var teamEvent = await _eventRepository.GetByIdAsync(eId, cancellationToken);
    if (teamEvent == null)
    {
      throw new KeyNotFoundException("Událost nebyla nalezena.");
    }

    var team = await _teamRepository.GetByIdAsync(teamEvent.TeamId, cancellationToken);
    var member = team?.Members.FirstOrDefault(m => m.UserId == userId);

    if (member == null || (member.Role != Domain.Entities.Teams.TeamEnums.TeamRole.Owner && member.Role != Domain.Entities.Teams.TeamEnums.TeamRole.Coach && teamEvent.CreatorId != userId))
    {
      throw new UnauthorizedAccessException("Nemáte právo smazat tuto událost.");
    }

    _eventRepository.Remove(teamEvent);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }
}
