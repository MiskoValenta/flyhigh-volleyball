'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateMatch } from "@/hooks/Matches/useCreateMatch";
import { useTeamList } from "@/hooks/Teams/useTeamList";
import { CreateMatchDto } from "@/types/match";
import { TeamResponseDto } from "@/types/team";
import "./CreateMatch.css";

export default function CreateMatchPage() {
    const router = useRouter();
    const { handleCreateMatch, isLoading, error } = useCreateMatch();
    const { teams, isLoading: isLoadingTeams, error: teamsError } = useTeamList();

    const [homeTeamId, setHomeTeamId] = useState<string>("");
    const [awayTeamId, setAwayTeamId] = useState<string>("");
    const [scheduledAt, setScheduledAt] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [refereeId, setRefereeId] = useState<string>("");

    useEffect(() => {
        if (teams.length > 0) {
            if (homeTeamId === "") {
                setHomeTeamId(teams[0].id);
            }
        }
    }, [teams, homeTeamId]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalRefereeId: string | null = refereeId;
        if (refereeId === "") {
            finalRefereeId = null;
        }

        const dto: CreateMatchDto = {
            homeTeamId: homeTeamId,
            awayTeamId: awayTeamId,
            scheduledAt: scheduledAt,
            location: location,
            refereeId: finalRefereeId
        };

        try {
            await handleCreateMatch(dto);
            router.push('/Dashboard/Matches');
        } catch (err) {
            console.error(err);
        }
    };

    let errorDisplay = null;
    if (error !== "") {
        errorDisplay = <div className="error-alert">{error}</div>;
    }
    if (teamsError !== "") {
        errorDisplay = <div className="error-alert">{teamsError}</div>;
    }

    let teamOptions = [];
    if (isLoadingTeams) {
        teamOptions.push(<option key="loading" value="">Načítám týmy...</option>);
    } else {
        if (teams.length === 0) {
            teamOptions.push(<option key="empty" value="">Nemáte žádné týmy</option>);
        } else {
            for (let i = 0; i < teams.length; i++) {
                const t: TeamResponseDto = teams[i];
                teamOptions.push(<option key={t.id} value={t.id}>{t.teamName}</option>);
            }
        }
    }

    let submitButtonText = "Vytvořit zápas";
    if (isLoading) {
        submitButtonText = "Vytvářím...";
    }

    return (
        <div className="creatematch-container">
            <h1 className="dashboard-heading">Nový zápas</h1>
            <p className="create-match-subtext">Vyplňte detaily pro navržení nového zápasu.</p>

            {errorDisplay}

            <div className="match-form-container glass-card-dark">
                <form onSubmit={onSubmit}>
                    <div className="form-row-cm">
                        <div className="form-group-cm">
                            <label>Domácí tým (Váš tým)</label>
                            <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} required>
                                {teamOptions}
                            </select>
                        </div>

                        <div className="form-group-cm">
                            <label>Hostující tým (ID Týmu soupeře)</label>
                            <input
                                type="text"
                                value={awayTeamId}
                                onChange={(e) => setAwayTeamId(e.target.value)}
                                placeholder="Zadejte ID týmu soupeře"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row-cm">
                        <div className="form-group-cm">
                            <label>Datum a čas</label>
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group-cm">
                            <label>Místo konání</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Název haly nebo hřiště"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-cm">
                        <label>ID Rozhodčího (Volitelné)</label>
                        <input
                            type="text"
                            value={refereeId}
                            onChange={(e) => setRefereeId(e.target.value)}
                            placeholder="Zadejte ID uživatele rozhodčího"
                        />
                    </div>

                    <div className="form-actions-cm">
                        <button type="submit" className="button-primary" disabled={isLoading}>
                            {submitButtonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}