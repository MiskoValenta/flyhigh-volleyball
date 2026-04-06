"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
    IoArrowBack,
    IoCalendarOutline,
    IoLocationOutline,
    IoPersonOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoTimeOutline,
    IoInformationCircleOutline
} from "react-icons/io5";
import { useEventDetail } from "@/hooks/Events/useEventDetail";
import { useTeamDetail } from "@/hooks/Teams/useTeamDetail";
import { EventResponse, EventType } from "@/types/event";
import "./EventDetail.css";

export default function EventDetailPage() {
    const params = useParams();
    const eventId = params.eventId as string;
    const router = useRouter();

    const { event, isLoading: eventLoading, handleRespond } = useEventDetail(eventId);
    const { team, isLoading: teamLoading } = useTeamDetail(event?.teamId || "");

    if (eventLoading || teamLoading) return <div className="ed-state-message">Načítám detaily události...</div>;
    if (!event) return <div className="ed-state-message error">Událost nebyla nalezena.</div>;

    const creator = team?.members.find(m => m.userId === event.creatorId);
    const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : "Neznámý tvůrce";

    const acceptedParticipants = team?.members.filter(member =>
        event.participants.some(p => p.userId === member.userId && p.response === EventResponse.Accepted)
    ) || [];

    const declinedParticipants = team?.members.filter(member =>
        event.participants.some(p => p.userId === member.userId && p.response === EventResponse.Declined)
    ) || [];

    const dateObj = event.eventDate ? new Date(event.eventDate) : null;

    return (
        <div className="event-detail-wrapper-ed">

            <div className="ed-top-bar">
                <button onClick={() => router.back()} className="ed-btn-back">
                    <IoArrowBack size={20} />
                    <span>Zpět</span>
                </button>
            </div>

            <div className="ed-main-card glass-card-dark">
                <div className="ed-header">
                    <span className={`ed-type-badge ed-type-${event.type}`}>
                        {event.type}
                    </span>
                    <h1 className="ed-title">{event.title}</h1>
                </div>

                <div className="ed-info-grid">
                    <div className="ed-info-item">
                        <IoCalendarOutline className="ed-info-icon" />
                        <div className="ed-info-content">
                            <span className="ed-info-label">Kdy</span>
                            <span className="ed-info-value">
                                {dateObj ? dateObj.toLocaleDateString("cs-CZ", { weekday: 'long', day: 'numeric', month: 'long' }) : "Datum neurčeno"}
                            </span>
                        </div>
                    </div>

                    <div className="ed-info-item">
                        <IoTimeOutline className="ed-info-icon" />
                        <div className="ed-info-content">
                            <span className="ed-info-label">Čas</span>
                            <span className="ed-info-value">
                                {dateObj ? dateObj.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }) : "Čas neurčen"}
                            </span>
                        </div>
                    </div>

                    <div className="ed-info-item">
                        <IoLocationOutline className="ed-info-icon" />
                        <div className="ed-info-content">
                            <span className="ed-info-label">Kde</span>
                            <span className="ed-info-value">{event.location || "Místo není specifikováno"}</span>
                        </div>
                    </div>

                    <div className="ed-info-item">
                        <IoPersonOutline className="ed-info-icon" />
                        <div className="ed-info-content">
                            <span className="ed-info-label">Organizátor</span>
                            <span className="ed-info-value">{creatorName}</span>
                        </div>
                    </div>
                </div>

                {event.description && (
                    <div className="ed-description-box">
                        <IoInformationCircleOutline className="ed-desc-icon" />
                        <p>{event.description}</p>
                    </div>
                )}
            </div>

            {event.type !== EventType.Announcement && (
                <>
                    <div className="ed-voting-card glass-card-dark">
                        <div className="ed-my-response-header">
                            <span className="ed-response-label">Vaše aktuální odpověď:</span>
                            <span className={`ed-current-status status-${event.myResponse}`}>
                                {event.myResponse === EventResponse.Unknown ? "Zatím jste neodpověděli" : event.myResponse}
                            </span>
                        </div>

                        <div className="ed-voting-actions">
                            <button
                                onClick={() => handleRespond(EventResponse.Accepted)}
                                className={`ed-vote-btn accept ${event.myResponse === EventResponse.Accepted ? 'active' : ''}`}
                            >
                                <IoCheckmarkCircleOutline size={22} />
                                Hraju / Jdu
                            </button>
                            <button
                                onClick={() => handleRespond(EventResponse.Declined)}
                                className={`ed-vote-btn decline ${event.myResponse === EventResponse.Declined ? 'active' : ''}`}
                            >
                                <IoCloseCircleOutline size={22} />
                                Nemůžu
                            </button>
                        </div>
                    </div>

                    <div className="ed-participants-container">
                        <div className="ed-list-section glass-card-dark">
                            <h2 className="ed-section-title green">
                                <IoCheckmarkCircleOutline /> Zúčastní se ({acceptedParticipants.length})
                            </h2>
                            <div className="ed-members-list">
                                {acceptedParticipants.length > 0 ? acceptedParticipants.map(member => (
                                    <div key={member.userId} className="ed-member-row">
                                        <span className="ed-member-name">{member.firstName} {member.lastName}</span>
                                        <span className={`role-badge role-${member.role}`}>{member.role}</span>
                                    </div>
                                )) : (
                                    <p className="ed-empty-text">Zatím nikdo nepotvrdil účast.</p>
                                )}
                            </div>
                        </div>

                        <div className="ed-list-section glass-card-dark">
                            <h2 className="ed-section-title red">
                                <IoCloseCircleOutline /> Omluvili se ({declinedParticipants.length})
                            </h2>
                            <div className="ed-members-list">
                                {declinedParticipants.length > 0 ? declinedParticipants.map(member => (
                                    <div key={member.userId} className="ed-member-row">
                                        <span className="ed-member-name">{member.firstName} {member.lastName}</span>
                                        <span className={`role-badge role-${member.role}`}>{member.role}</span>
                                    </div>
                                )) : (
                                    <p className="ed-empty-text">Zatím se nikdo neomluvil.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}