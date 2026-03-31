'use client';

import React from "react";
import Link from "next/link";
import { useTeamsList } from "@/hooks/Teams/useTeamList";
import { Team } from "@/types/team";
import "./Teams.css";

export default function TeamsPage() {
    const { teams, error, isLoading } = useTeamsList();

    if (isLoading) return <div className="teams-empty-state">Načítám tvé týmy...</div>;

    return (
        <div className="teams-container">
            <div className="teams-header-row">
                <h1 className="dashboard-heading">Moje Týmy</h1>
                <div className="header-actions">
                    <Link href="/Dashboard/CreateTeam" className="btn-primary">
                        + Založit nový tým
                    </Link>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {teams.length === 0 ? (
                <div className="teams-empty-state">
                    <p>Zatím nejste členem žádného týmu.</p>
                </div>
            ) : (
                <div className="teams-grid">
                    {teams.map((team: Team) => (
                        <Link
                            href={`/Dashboard/Teams/${team.id}`}
                            key={team.id}
                            className="team-card glass-card"
                        >
                            <div className="team-header">
                                <h2 className="team-name">{team.teamName}</h2>
                                <span className={`team-role-badge role-${team.role?.toLowerCase() || 'player'}`}>
                                    {team.role}
                                </span>
                            </div>
                            <div className="team-details">
                                <div className="detail-row">
                                    <span>Zkratka:</span>
                                    <span className="team-code">{team.shortName}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Status:</span>
                                    <span>{team.status}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}