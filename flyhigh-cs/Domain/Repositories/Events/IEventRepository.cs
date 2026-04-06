using Domain.Entities.Events;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Teams;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Repositories.Events;

public interface IEventRepository
{
  Task<Event?> GetByIdAsync(EventId id, CancellationToken cancellationToken = default);
  Task AddAsync(Event ev, CancellationToken cancellationToken = default);
  void Delete(Event ev);
  Task<IEnumerable<Event>> GetEventsByTeamIdAsync(TeamId teamId, CancellationToken cancellationToken = default);
}
