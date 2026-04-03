using Application.DTOs.Events;
using Domain.Entities.Events.EventEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Events;

public interface IEventService
{
  Task<Guid> CreateEventAsync(CreateEventDto dto, Guid currentUserId, CancellationToken cancellationToken = default);
  Task<IEnumerable<EventDto>> GetTeamEventsAsync(Guid teamId, Guid currentUserId, CancellationToken cancellationToken = default);
  Task<EventDto> GetEventDetailAsync(Guid eventId, Guid currentUserId, CancellationToken cancellationToken = default);
  Task RespondToEventAsync(Guid eventId, Guid currentUserId, EventResponse response, CancellationToken cancellationToken = default);
  Task DeleteEventAsync(Guid eventId, Guid currentUserId, CancellationToken cancellationToken = default);
}