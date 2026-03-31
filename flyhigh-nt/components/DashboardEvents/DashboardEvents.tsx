'use client';

import React from 'react';
import { useDashboardEvents } from '@/hooks/Events/useDashboardEvents';
import { TeamEvent } from '@/types/event';
import './DashboardEvents.css';

interface DashboardEventsProps {
    teamId: string;
}

export default function DashboardEvents({ teamId }: DashboardEventsProps) {
    const { events, isLoading, error } = useDashboardEvents(teamId);

    if (isLoading) return <div className="EventsLoading">Načítání událostí...</div>;
    if (error) return <div className="EventsError">{error}</div>;

    return (
        <div className="DashboardEventsContainer">
            <h2 className="EventsHeading">Nadcházející události</h2>

            {events.length === 0 ? (
                <p className="NoEventsText">Zatím žádné naplánované události.</p>
            ) : (
                <ul className="EventsList">
                    {events.map((event: TeamEvent) => (
                        <li key={event.id} className="EventCard">
                            <div className="EventInfo">
                                <h3 className="EventTitle">{event.title}</h3>
                                {event.eventDate && (
                                    <p className="EventDate">
                                        {new Date(event.eventDate).toLocaleDateString('cs-CZ')}
                                    </p>
                                )}
                            </div>
                            <div className="EventStatus">
                                <span className="EventTypeBadge">{event.type}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}