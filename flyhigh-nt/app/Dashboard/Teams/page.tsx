'use client';

import React from 'react';
import Link from 'next/link';
import { useTeamsList } from '@/hooks/Teams/useTeamList';
import { Team } from '@/types/team';
import './Teams.css';

export default function TeamsPage() {
    const { teams, error, isLoading } = useTeamsList();

    if (isLoading) return <div>Načítám tvé týmy...</div>;

    return (
        <div className="teams-container">
            <div className="teams-header-row">
                <h1 className="dashboard-heading">Moje Týmy</h1>
                <div className="header-actions">
                    <Link href="/Dashboard/CreateTeam" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', textDecoration: 'none' }}>
                        + Založit nový tým
                    </Link>
                </div>
            </div>

            {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '8px' }}>{error}</div>}

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
                            className="team-card"
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