using Application.Common.Interfaces;
using Application.DTOs.Events;
using Application.Interfaces.Events;
using Application.Interfaces.Teams;
using Domain.Entities.Events;
using Domain.Entities.Events.EventEnums;
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
  private readonly ITeamAuthorizationService _authService;

  public EventService(
      IEventRepository eventRepository,
      ITeamRepository teamRepository,
      IUnitOfWork unitOfWork,
      ITeamAuthorizationService authService)
  {
    _eventRepository = eventRepository;
    _teamRepository = teamRepository;
    _unitOfWork = unitOfWork;
    _authService = authService;
  }

  public async Task<Guid> CreateEventAsync(CreateEventDto dto, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    bool isAuthorized = await _authService.HasRoleInTeamAsync(currentUserId, dto.TeamId, Domain.Entities.Teams.TeamEnums.TeamRole.Owner, Domain.Entities.Teams.TeamEnums.TeamRole.Coach);
    if (!isAuthorized)
    {
      throw new UnauthorizedAccessException("Nemáte oprávnění vytvářet události v tomto týmu.");
    }

    var newEvent = Event.Create(
        new UserId(currentUserId),
        new TeamId(dto.TeamId),
        dto.Title,
        dto.Description,
        dto.Type,
        dto.EventDate,
        dto.Location
    );

    if (dto.InvitedUserIds != null)
    {
      foreach (var invitedUserId in dto.InvitedUserIds)
      {
        newEvent.AddParticipant(new UserId(invitedUserId));
      }
    }

    await _eventRepository.AddAsync(newEvent, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return newEvent.Id.Value;
  }

  public async Task<IEnumerable<EventDto>> GetTeamEventsAsync(Guid teamId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var events = await _eventRepository.GetEventsByTeamIdAsync(new TeamId(teamId), cancellationToken);

    var dtos = new List<EventDto>();
    foreach (var e in events)
    {
      var participantDtos = new List<EventParticipantDto>();
      foreach (var p in e.Participants)
      {
        participantDtos.Add(new EventParticipantDto(p.UserId.Value, p.Response));
      }

      string myResponse = "Unknown";
      var me = e.Participants.FirstOrDefault(p => p.UserId.Value == currentUserId);
      if (me != null)
      {
        myResponse = me.Response.ToString();
      }

      int accepted = e.Participants.Count(p => p.Response == EventResponse.Accepted);
      int declined = e.Participants.Count(p => p.Response == EventResponse.Declined);

      dtos.Add(new EventDto(
          e.Id.Value,
          e.TeamId.Value,
          e.CreatorId.Value,
          e.Title,
          e.Description,
          e.Type,
          e.EventDate,
          e.Location,
          e.CreatedAt,
          participantDtos,
          myResponse,
          accepted,
          declined
      ));
    }

    return dtos.OrderBy(e => e.EventDate).ToList();
  }

  public async Task<EventDto> GetEventDetailAsync(Guid eventId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var e = await _eventRepository.GetByIdAsync(new EventId(eventId), cancellationToken);
    if (e == null)
    {
      throw new KeyNotFoundException("Událost nenalezena.");
    }

    var participantDtos = new List<EventParticipantDto>();
    foreach (var p in e.Participants)
    {
      participantDtos.Add(new EventParticipantDto(p.UserId.Value, p.Response));
    }

    string myResponse = "Unknown";
    var me = e.Participants.FirstOrDefault(p => p.UserId.Value == currentUserId);
    if (me != null)
    {
      myResponse = me.Response.ToString();
    }

    int accepted = e.Participants.Count(p => p.Response == EventResponse.Accepted);
    int declined = e.Participants.Count(p => p.Response == EventResponse.Declined);

    return new EventDto(
        e.Id.Value,
        e.TeamId.Value,
        e.CreatorId.Value,
        e.Title,
        e.Description,
        e.Type,
        e.EventDate,
        e.Location,
        e.CreatedAt,
        participantDtos,
        myResponse,
        accepted,
        declined
    );
  }

  public async Task RespondToEventAsync(Guid eventId, Guid currentUserId, EventResponse response, CancellationToken cancellationToken = default)
  {
    var ev = await _eventRepository.GetByIdAsync(new EventId(eventId), cancellationToken);
    if (ev == null)
    {
      throw new KeyNotFoundException("Událost nenalezena.");
    }

    ev.Respond(new UserId(currentUserId), response);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task DeleteEventAsync(Guid eventId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var ev = await _eventRepository.GetByIdAsync(new EventId(eventId), cancellationToken);
    if (ev == null)
    {
      throw new KeyNotFoundException("Událost nenalezena.");
    }

    bool isAuthorized = await _authService.HasRoleInTeamAsync(currentUserId, ev.TeamId.Value, Domain.Entities.Teams.TeamEnums.TeamRole.Owner, Domain.Entities.Teams.TeamEnums.TeamRole.Coach);
    if (!isAuthorized)
    {
      if (ev.CreatorId.Value != currentUserId)
      {
        throw new UnauthorizedAccessException("Nemáte oprávnění smazat tuto událost.");
      }
    }

    _eventRepository.Delete(ev);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }
}