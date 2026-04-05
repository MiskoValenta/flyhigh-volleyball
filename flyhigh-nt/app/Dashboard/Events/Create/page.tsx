"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoCalendarOutline, IoLocationOutline, IoInformationCircleOutline } from "react-icons/io5";
import { useCreateEvent } from "../../../../hooks/Events/useCreateEvent";
import { EventType } from "../../../../types/event";
import "./CreateEvent.css";

export default function CreateEventPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const defaultTeamId = searchParams.get("teamId") || "";

    const { handleCreateEvent, isLoading, error } = useCreateEvent();

    const [teamId, setTeamId] = useState(defaultTeamId);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<EventType>(EventType.Match);
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        if (!teamId) {
            alert("Není vybrán žádný tým. Přesměrovávám zpět.");
            router.push("/Dashboard/Teams");
        }
    }, [teamId, router]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedDate = eventDate ? new Date(eventDate).toISOString() : null;

        await handleCreateEvent({
            teamId,
            title,
            description: description || null,
            type,
            eventDate: formattedDate,
            location: location || null,
            invitedUserIds: []
        });
    };

    if (!teamId) return null;

    return (
        <div className="create-event-wrapper-ce">
            <div className="create-top-bar-ce">
                <Link href={`/Dashboard/Teams/${teamId}`} className="btn-back-ce">
                    <IoArrowBack size={20} />
                    <span>Zpět na tým</span>
                </Link>
            </div>

            <div className="create-event-card-ce glass-card-dark">
                <h1 className="create-event-title-ce">Vytvořit novou událost</h1>
                <p className="create-event-desc-ce">
                    Naplánujte zápas, tréninkovou anketu nebo pošlete členům oznámení.
                </p>

                {error && <div className="error-message-ce">{error}</div>}

                <form onSubmit={onSubmit} className="create-event-form-ce">

                    <div className="form-group-ce">
                        <label>Název události *</label>
                        <input
                            type="text"
                            className="input-glass-ce"
                            required
                            placeholder="Např. Sobotní zápas proti Orlům"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-row-ce">
                        <div className="form-group-ce">
                            <label>Typ události *</label>
                            <select
                                className="input-glass-ce select-glass-ce"
                                value={type}
                                onChange={(e) => setType(e.target.value as EventType)}
                            >
                                <option value={EventType.Match}>Zápas</option>
                                <option value={EventType.Poll}>Anketa</option>
                                <option value={EventType.Announcement}>Oznámení</option>
                            </select>
                        </div>

                        <div className="form-group-ce">
                            <label>Datum a čas</label>
                            <div className="input-icon-wrapper-ce">
                                <IoCalendarOutline className="input-icon-ce" />
                                <input
                                    type="datetime-local"
                                    className="input-glass-ce with-icon-ce"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group-ce">
                        <label>Místo konání</label>
                        <div className="input-icon-wrapper-ce">
                            <IoLocationOutline className="input-icon-ce" />
                            <input
                                type="text"
                                className="input-glass-ce with-icon-ce"
                                placeholder="Adresa nebo název haly"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group-ce">
                        <label>Doplňující informace</label>
                        <div className="input-icon-wrapper-ce text-area-wrapper-ce">
                            <IoInformationCircleOutline className="input-icon-ce top-icon-ce" />
                            <textarea
                                className="input-glass-ce with-icon-ce textarea-glass-ce"
                                rows={4}
                                placeholder="Co si vzít s sebou, sraz apod."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="button-primary submit-btn-ce" disabled={isLoading}>
                        {isLoading ? "Vytvářím..." : "Vytvořit událost"}
                    </button>
                </form>
            </div>
        </div>
    );
}