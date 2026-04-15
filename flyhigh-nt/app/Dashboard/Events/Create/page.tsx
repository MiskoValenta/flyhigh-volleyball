"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoCalendarOutline, IoLocationOutline, IoInformationCircleOutline } from "react-icons/io5";
import { useCreateEvent } from "@/hooks/Events/useCreateEvent";
import { EventType } from "@/types/event";
import { getMyTeams } from "@/lib/teamApi";
import "./CreateEvent.css";

export default function CreateEventPage() {
    const searchParams = useSearchParams();
    const defaultTeamId = searchParams.get("teamId") || "";

    const { handleCreateEvent, isLoading, error } = useCreateEvent();

    const [teamId, setTeamId] = useState(defaultTeamId);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<EventType>(EventType.Match);
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");

    const [teams, setTeams] = useState<{ id: string, teamName: string }[]>([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            setIsLoadingTeams(true);
            try {
                const myTeams = await getMyTeams();
                setTeams(myTeams);

                if (!defaultTeamId && myTeams.length === 1) {
                    setTeamId(myTeams[0].id);
                }
            } catch (err) {
                console.error("Nepodařilo se načíst týmy", err);
            } finally {
                setIsLoadingTeams(false);
            }
        };

        fetchTeams();
    }, [defaultTeamId]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teamId) {
            alert("Prosím, vyberte tým, pro který je událost určena.");
            return;
        }

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

    const backLink = defaultTeamId ? `/Dashboard/Teams/${defaultTeamId}` : "/Dashboard";
    const backText = defaultTeamId ? "Zpět na tým" : "Zpět na přehled";

    return (
        <div className="create-event-wrapper-ce">
            <div className="create-top-bar-ce">
                <Link href={backLink} className="btn-back-ce">
                    <IoArrowBack size={20} />
                    <span>{backText}</span>
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
                        <label>Tým *</label>
                        <select
                            className="input-glass-ce select-glass-ce"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            required
                            disabled={isLoadingTeams}
                        >
                            <option value="" disabled>
                                {isLoadingTeams ? "Načítám dostupné týmy..." : "Vyberte tým, pro který je událost určena"}
                            </option>
                            {teams.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.teamName}
                                </option>
                            ))}
                        </select>
                    </div>

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

                    <button
                        type="submit"
                        className="button-primary submit-btn-ce"
                        disabled={isLoading || !teamId || isLoadingTeams}
                    >
                        {isLoading ? "Vytvářím..." : "Vytvořit událost"}
                    </button>
                </form>
            </div>
        </div>
    );
}