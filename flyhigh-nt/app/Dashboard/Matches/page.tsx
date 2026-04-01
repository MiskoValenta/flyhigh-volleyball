'use client';

import React from 'react';
import Link from 'next/link';
import { IoLocationOutline } from 'react-icons/io5';
import { useMatchesList } from '@/hooks/Matches/useMatchesList';
import { MatchResponseDto } from '@/types/match';
import './Matches.css';

export default function MatchesPage() {
    const { matches, error, isLoading } = useMatchesList();

    if (isLoading) return <div className="matches-empty-state">Načítám zápasy...</div>;

    return (
        <div className="matches-section">
            <div className="matches-header-row">
                <h1 className="dashboard-heading">Rozpis Zápasů</h1>
                <Link href="/Dashboard/Matches/Create" className="button-primary">
                    + Navrhnout zápas
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            {matches.length === 0 ? (
                <div className="matches-empty-state glass-card-dark">
                    <p>Zatím nemáte naplánované žádné zápasy.</p>
                </div>
            ) : (
                <div className="matches-grid">
                    {matches.map((match: MatchResponseDto) => (
                        <Link href={`/Dashboard/Matches/${match.id}`} key={match.id} className="match-card clickable glass-card-dark">
                            <div className="match-card-header">
                                <span className="match-date">
                                    {new Date(match.scheduledAt).toLocaleDateString('cs-CZ')}
                                </span>
                                <span className={`match-status-badge status-${match.status.toLowerCase()}`}>
                                    {match.status}
                                </span>
                            </div>
                            <div className="match-teams">
                                <span className="team-name-match team-home">{match.homeTeamName}</span>
                                <span className="vs-text">vs</span>
                                <span className="team-name-match team-away">{match.awayTeamName}</span>
                            </div>
                            <div className="match-location">
                                <IoLocationOutline className="location-icon" />
                                <span>{match.location}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}