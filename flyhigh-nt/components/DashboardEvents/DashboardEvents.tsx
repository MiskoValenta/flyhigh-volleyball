'use client';

import React from 'react';
import { useDashboardEvents } from '@/hooks/Events/useDashboardEvents';
import { TeamEvent } from '@/types/event';
import "./DashboardEvents.css";

interface DashboardEventsProps {
    teamId: string;
}

export default function DashboardEvents({ teamId }: DashboardEventsProps) {
    const { events, isLoading, error } = useDashboardEvents(teamId);

    if (isLoading) return <div className="events-status-box">Načítání událostí...</div>;
    if (error) return <div className="events-status-box error">{error}</div>;

    const getBadgeClass = (type: string) => {
        switch (type.toLowerCase()) {
            case 'match': return 'badge-match';
            case 'announcement': return 'badge-announcement';
            case 'poll': return 'badge-poll';
            default: return 'badge-announcement';
        }
    };

    return (
        <div className="dashboard-events-container">
            <h2 className="event-title">Nadcházející události</h2>

            {events.length === 0 ? (
                <div className="events-status-box">Zatím žádné naplánované události.</div>
            ) : (
                events.map((event: TeamEvent) => (
                    <div key={event.id} className="event-card">
                        <div className="event-card-header">
                            <div className="event-title-row">
                                <h3 className="event-title">{event.title}</h3>
                                <span className={`event-badge ${getBadgeClass(event.type)}`}>
                                    {event.type}
                                </span>
                            </div>
                            <div className="event-header-right">
                                {event.eventDate && (
                                    <span className="event-date">
                                        {new Date(event.eventDate).toLocaleDateString('cs-CZ')}
                                    </span>
                                )}
                            </div>
                        </div>
                        {event.description && (
                            <p className="event-description">{event.description}</p>
                        )}
                        {event.location && (
                            <p className="event-location">{event.location}</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}