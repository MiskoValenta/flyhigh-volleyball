"use client";

import React from "react";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { useTeamList } from "@/hooks/Teams/useTeamList";
import { TeamRole } from "@/types/team";
import "./Teams.css";

export default function TeamsPage() {
    const { teams, isLoading, error } = useTeamList();

    if (isLoading)
        return <div className="teams-state-message">Načítám týmy...</div>;
    
    if (error)
        return <div className="teams-state-message error">Chyba: {error}</div>;

    return (
        <div className="teams-page-wrapper">
            <div className="teams-page-header">
                <h1 className="dashboard-heading">Moje Týmy</h1>
                {teams.length > 0 && (
                    <Link href="/Dashboard/CreateTeam" className="button-primary">
                        + Nový tým
                    </Link>
                )}
            </div>

            <div className="teams-container">
                {teams.length > 0 ? (
                    teams.map((team) => {
                        const role = team.role || TeamRole.Member;
                        const playerCount = team.playerCount || 0;

                        return (
                            <Link
                                key={team.id}
                                href={`/Dashboard/Teams/${team.id}`}
                                className="team-card glass-card-dark"
                            >
                                <div className="team-header">
                                    <h3 className="team-name">{team.teamName}</h3>
                                    <span className="team-abbreviation">
                                        {team.shortName}
                                    </span>
                                </div>

                                <hr className="team-divider" />

                                <div className="team-info-row">
                                    <span className="info-label">Moje role:</span>
                                    <span className={`role-badge role-${role}`}>
                                        {role}
                                    </span>
                                </div>

                                <div className="team-info-row">
                                    <span className="info-label">Počet hráčů:</span>
                                    <span className="info-value highlight">{playerCount}</span>
                                </div>

                                <div className="team-card-footer">
                                    <span className="show-more-text">
                                        Zobrazit detail <IoChevronForward className="show-more-icon" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="teams-empty-state glass-card-dark">
                        <p className="teams-empty-text">Zatím nejste v žádném týmu.</p>
                        <Link
                            href="/Dashboard/CreateTeam"
                            className="button-primary"
                        >
                            Vytvořit první tým
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}