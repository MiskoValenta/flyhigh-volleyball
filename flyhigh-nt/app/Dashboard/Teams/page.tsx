'use client';

import React from 'react';
import Link from 'next/link';
import { useTeamList } from '@/hooks/Teams/useTeamList';
import { Team } from '@/types/team';
import './Teams.css';

export default function TeamsPage() {
    const { teams, error, isLoading } = useTeamList();

    if (isLoading)
        return <div className="teams-empty-state">Načítám tvé týmy...</div>;

    return (
        <div className="teams-container">
            <div className="teams-header-row">
                <h1 className="dashboard-heading">Moje Týmy</h1>
                <div className="header-actions">
                    <Link href="/Dashboard/CreateTeam" className="button-primary">
                        + Založit nový tým
                    </Link>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {teams.length === 0 ? (
                <div className="teams-empty-state glass-card-dark">
                    <p>Zatím nejste členem žádného týmu.</p>
                </div>
            ) : (
                <div className="teams-grid">
                    {teams.map((team: Team) => (
                        <Link
                            href={`/Dashboard/Teams/${team.id}`}
                            key={team.id}
                            className="team-card glass-card-dark"
                        >
                            <div className="team-card-header">
                                <h2 className="team-name-title">{team.teamName}</h2>
                                <span className="team-code-pill">{team.shortName}</span>
                            </div>

                            <div className="team-card-body glass-card-dark">
                                <div className="team-stat-row">
                                    <span className="stat-label">Moje role:</span>
                                    <span className={`role-text role-${team.role?.toLowerCase() || 'player'}`}>
                                        {team.role || 'Player'}
                                    </span>
                                </div>
                                <div className="team-stat-row">
                                    <span className="stat-label">Počet členů:</span>
                                    <span className="stat-value-text">{(team as any).membersCount || 0}</span>
                                </div>
                                <div className="team-stat-row">
                                    <span className="stat-label">Události:</span>
                                    <span className="stat-value-text">{(team as any).eventsCount || 0}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}