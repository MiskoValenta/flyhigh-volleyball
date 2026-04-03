'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateEvent } from "@/hooks/Events/useCreateEvent";
import { getMyTeams } from "@/lib/teamApi";
import { Team } from "@/types/team";
import { CreateEventDto } from "@/types/event";
import "./CreateEvent.css";

export default function CreateEventPage() {
    const router = useRouter();
    const { handleCreateEvent, isLoading, error } = useCreateEvent();

    const [myTeams, setMyTeams] = useState<Team[]>([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(true);

    const [teamId, setTeamId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventType, setEventType] = useState("Training");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        const fetchTeams = async () => {
            setIsLoadingTeams(true);
            try {
                const teams = await getMyTeams();
                setMyTeams(teams);
                if (teams.length > 0) {
                    setTeamId(teams[0].id);
                }
            } catch (err) {
                console.error("Nepodařilo se načíst týmy.", err);
            } finally {
                setIsLoadingTeams(false);
            }
        };
        fetchTeams();
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dto: CreateEventDto = {
            teamId: teamId,
            title: title,
            description: description,
            type: eventType,
            eventDate: eventDate,
            location: location,
            invitedUserIds: []
        };

        try {
            await handleCreateEvent(dto);
            router.push('/Dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    let errorDisplay = null;
    if (error !== "") {
        errorDisplay = <div className="error-alert">{error}</div>;
    }

    let teamOptions = [];
    if (isLoadingTeams) {
        teamOptions.push(<option key="loading" value="">Načítám týmy...</option>);
    } else {
        if (myTeams.length === 0) {
            teamOptions.push(<option key="empty" value="">Nemáte žádné týmy</option>);
        } else {
            for (let i = 0; i < myTeams.length; i++) {
                const t = myTeams[i];
                teamOptions.push(<option key={t.id} value={t.id}>{t.teamName}</option>);
            }
        }
    }

    let submitButtonText = "Vytvořit událost";
    if (isLoading) {
        submitButtonText = "Vytvářím...";
    }

    return (
        <div className="createevent-container">
            <h1 className="dashboard-heading">Nová událost</h1>
            <p className="create-event-subtext">Vyplňte detaily pro vytvoření nové události.</p>

            {errorDisplay}

            <div className="event-form-container glass-card-dark">
                <form onSubmit={onSubmit}>
                    <div className="form-row-ce">
                        <div className="form-group-ce">
                            <label>Tým</label>
                            <select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
                                {teamOptions}
                            </select>
                        </div>

                        <div className="form-group-ce">
                            <label>Typ události</label>
                            <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                                <option value="Training">Trénink</option>
                                <option value="Match">Zápas</option>
                                <option value="Tournament">Turnaj</option>
                                <option value="Meeting">Schůze</option>
                                <option value="Other">Jiné</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group-ce">
                        <label>Název události</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row-ce">
                        <div className="form-group-ce">
                            <label>Datum a čas (volitelné)</label>
                            <input
                                type="datetime-local"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group-ce">
                            <label>Místo konání (volitelné)</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group-ce">
                        <label>Popis (volitelné)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-actions-ce">
                        <button type="submit" className="button-primary" disabled={isLoading}>
                            {submitButtonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}