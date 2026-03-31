'use client';

import React from 'react';
import Link from 'next/link';
import { useTeamsList } from '@/hooks/Teams/useTeamList';
import { Team } from '@/types/team';
import './Teams.css';

export default function TeamsPage() {
    const { teams, error, isLoading } = useTeamsList();

    if (isLoading) return <div className="TeamsLoading">Načítám tvé týmy...</div>;

    return (
        <div className="TeamsContainer">
            <div className="TeamsHeader">
                <h1 className="TeamsTitle">Moje Týmy</h1>
                <Link href="/Dashboard/CreateTeam" className="CreateTeamButton">
                    + Založit nový tým
                </Link>
            </div>

            {error && <div className="TeamsError">{error}</div>}

            {teams.length === 0 ? (
                <div className="EmptyStateCard">
                    <p>Zatím nejsi členem žádného týmu.</p>
                </div>
            ) : (
                <div className="TeamsGrid">
                    {teams.map((team: Team) => (
                        <Link
                            href={`/Dashboard/Teams/${team.id}`}
                            key={team.id}
                            className="TeamCard"
                        >
                            <div className="TeamCardHeader">
                                <h2 className="TeamCardName">{team.teamName}</h2>
                                <span className="TeamCardShort">{team.shortName}</span>
                            </div>
                            <div className="TeamCardBody">
                                <p className="TeamRole">Tvoje role: <strong>{team.role}</strong></p>
                                <span className={`StatusBadge ${team.status?.toLowerCase()}`}>
                                    {team.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}