'use client';

import React from 'react';
import { useTeamsList } from '@/hooks/Teams/useTeamList';
import './Teams.css';

export default function TeamsPage() {
    const { teams, error, isLoading } = useTeamsList();

    let content = null;
    if (isLoading === true) {
        content = <p>Načítám týmy...</p>;
    } else {
        if (error !== '') {
            content = <p className="error-message">{error}</p>;
        } else {
            content = (
                <div className="teams-grid">
                    {teams.map((team: { id: string, teamName: string, role: string }) => (
                        <div key={team.id} className="team-card">
                            <h3>{team.teamName}</h3>
                            <p>Role: {team.role}</p>
                            <a href={`/Dashboard/Teams/${team.id}`} className="detail-link">Zobrazit detail</a>
                        </div>
                    ))}
                </div>
            );
        }
    }

    return (
        <div className="teams-container">
            <h1 className="teams-title">Moje Týmy</h1>
            {content}
        </div>
    );
}