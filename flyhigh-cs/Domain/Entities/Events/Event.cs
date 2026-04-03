using Domain.Common;
using Domain.Entities.Events.EventEnums;
using Domain.Entities.Events.EventExceptions;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Events;

public class Event : AuditableEntity<EventId>
{
  public TeamId TeamId { get; private set; }
  public UserId CreatorId { get; private set; }
  public string Title { get; private set; }
  public string? Description { get; private set; }
  public EventType Type { get; private set; }
  public DateTime? EventDate { get; private set; }
  public string? Location { get; private set; }

  private readonly List<EventParticipant> _participants = new();
  public IReadOnlyCollection<EventParticipant> Participants => _participants.AsReadOnly();

  private Event() { }

  private Event(EventId id, TeamId teamId, UserId creatorId, string title, string? description, EventType type, DateTime? eventDate, string? location)
      : base(id)
  {
    TeamId = teamId;
    CreatorId = creatorId;
    Title = title;
    Description = description;
    Type = type;
    EventDate = eventDate;
    Location = location;
  }

  public static Event Create(UserId creatorId, TeamId teamId, string title, string? description, EventType type, DateTime? eventDate, string? location)
  {
    if (string.IsNullOrWhiteSpace(title))
    {
      throw new EventInvalidException("Název události je povinný.");
    }

    return new Event(new EventId(Guid.NewGuid()), teamId, creatorId, title, description, type, eventDate, location);
  }

  public void AddParticipant(UserId userId)
  {
    var exists = false;
    foreach (var p in _participants)
    {
      if (p.UserId == userId)
      {
        exists = true;
      }
    }

    if (!exists)
    {
      _participants.Add(new EventParticipant(new EventParticipantId(Guid.NewGuid()), Id, userId));
    }
  }

  public void Respond(UserId userId, EventResponse response)
  {
    var participant = _participants.FirstOrDefault(p => p.UserId == userId);
    if (participant == null)
    {
      var newParticipant = new EventParticipant(new EventParticipantId(Guid.NewGuid()), Id, userId);
      newParticipant.UpdateResponse(response);
      _participants.Add(newParticipant);
    }
    else
    {
      participant.UpdateResponse(response);
    }
  }
}