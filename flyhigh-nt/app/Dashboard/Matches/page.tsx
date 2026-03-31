'use client';

import React from 'react';
import Link from 'next/link';
import { useMatchesList } from '@/hooks/Matches/useMatchesList';
import { MatchResponseDto } from '@/types/match';
import './Matches.css';

export default function MatchesPage() {
    const { matches, error, isLoading } = useMatchesList();

    if (isLoading) return <div className="MatchesLoading">Načítám zápasy...</div>;

    return (
        <div className="MatchesContainer">
            <div className="MatchesHeader">
                <h1 className="MatchesTitle">Rozpis Zápasů</h1>
                <Link href="/Dashboard/Matches/Create" className="CreateMatchButton">
                    + Navrhnout zápas
                </Link>
            </div>

            {error && <div className="ErrorMessage">{error}</div>}

            {matches.length === 0 ? (
                <div className="EmptyStateCard">
                    <p>Zatím nemáš naplánované žádné zápasy.</p>
                </div>
            ) : (
                <div className="MatchesGrid">
                    {matches.map((match: MatchResponseDto) => (
                        <Link href={`/Dashboard/Matches/${match.id}`} key={match.id} className="MatchCard">
                            <div className="MatchTeams">
                                <span className="TeamName">{match.homeTeamName}</span>
                                <span className="Versus">vs</span>
                                <span className="TeamName">{match.awayTeamName}</span>
                            </div>
                            <div className="MatchInfo">
                                <p className="MatchDate">
                                    {new Date(match.scheduledAt).toLocaleDateString('cs-CZ')}
                                </p>
                                <p className="MatchLocation">📍 {match.location}</p>
                                <span className={`MatchStatusBadge ${match.status.toLowerCase()}`}>
                                    {match.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}