'use client';

import React from 'react';
import Link from 'next/link';
import { useMatchesList } from '@/hooks/Matches/useMatchesList';
import { MatchResponseDto } from '@/types/match';
import './Matches.css';

export default function MatchesPage() {
    const { matches, error, isLoading } = useMatchesList();

    if (isLoading) return <div>Načítám zápasy...</div>;

    return (
        <div className="matches-section">
            <div className="matches-header-row">
                <h1 className="dashboard-heading section-title">Rozpis Zápasů</h1>
                <Link href="/Dashboard/Matches/Create" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', textDecoration: 'none' }}>
                    + Navrhnout zápas
                </Link>
            </div>

            {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '8px' }}>{error}</div>}

            {matches.length === 0 ? (
                <div className="matches-empty-state">
                    <p>Zatím nemáte naplánované žádné zápasy.</p>
                </div>
            ) : (
                <div className="matches-grid">
                    {matches.map((match: MatchResponseDto) => (
                        <Link href={`/Dashboard/Matches/${match.id}`} key={match.id} className="match-card clickable">
                            <div className="match-header">
                                <span className="match-date">
                                    {new Date(match.scheduledAt).toLocaleDateString('cs-CZ')}
                                </span>
                                <span className={`match-status-badge status-${match.status.toLowerCase()}`}>
                                    {match.status}
                                </span>
                            </div>
                            <div className="match-teams">
                                <span className="team-name team-home">{match.homeTeamName}</span>
                                <span className="vs-text">vs</span>
                                <span className="team-name team-away">{match.awayTeamName}</span>
                            </div>
                            <div className="match-location">
                                📍 {match.location}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}