"use client";

import React from "react";
import Link from "next/link";
import { IoCalendarOutline, IoLocationOutline, IoCheckmarkCircle, IoCloseCircle, IoHelpCircle } from "react-icons/io5";
import { EventDto, EventType, EventResponse } from "@/types/event";
import "./DashboardEvents.css";

interface Props {
    events: EventDto[];
}

export default function DashboardEvents({ events }: Props) {

    const getBadgeClass = (type: string) => {
        switch (type) {
            case EventType.Match: return "badge-match";
            case EventType.Poll: return "badge-poll";
            case EventType.Announcement: return "badge-announcement";
            default: return "badge-announcement";
        }
    };

    const getResponseIcon = (response: string) => {
        switch (response) {
            case EventResponse.Accepted: return <IoCheckmarkCircle className="resp-icon text-green" />;
            case EventResponse.Declined: return <IoCloseCircle className="resp-icon text-red" />;
            default: return <IoHelpCircle className="resp-icon text-yellow" />;
        }
    };

    if (events.length === 0) {
        return (
            <div className="events-empty-state glass-card-dark">
                <IoCalendarOutline size={40} />
                <p>Tento tým zatím nemá žádné události.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-events-grid">
            {events.map((event) => {
                const dateObj = event.eventDate ? new Date(event.eventDate) : null;

                return (
                    <Link href={`/Dashboard/Events/${event.id}`} key={event.id} className="event-card glass-card-dark">

                        <div className="event-header">
                            <span className={`event-type-badge ${getBadgeClass(event.type)}`}>
                                {event.type}
                            </span>
                            {dateObj && (
                                <span className="event-date">
                                    {dateObj.toLocaleDateString("cs-CZ", { day: 'numeric', month: 'short' })} v {dateObj.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>

                        <div className="event-body">
                            <h3 className="event-title">{event.title}</h3>
                            {event.location && (
                                <div className="event-location">
                                    <IoLocationOutline />
                                    <span>{event.location}</span>
                                </div>
                            )}
                        </div>

                        <hr className="event-divider" />

                        <div className="event-footer">
                            <div className="event-stats">
                                <span className="stat-green">{event.acceptedCount} Zúčastní se</span>
                                <span className="stat-red">{event.declinedCount} Nezúčastní</span>
                            </div>

                            <div className="my-response-box">
                                <span className="response-label">Moje odpověď:</span>
                                <div className="response-status">
                                    {getResponseIcon(event.myResponse)}
                                    <span className="response-text">{event.myResponse}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}