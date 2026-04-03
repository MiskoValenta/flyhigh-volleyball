'use client';

import React from 'react';
import Link from 'next/link';
import { useMatchesList } from '@/hooks/Matches/useMatchesList';
import { MatchStatus, MatchResponseDto } from '@/types/match';
import './Matches.css';

export default function MatchesPage() {
    const { matches, isLoading, error } = useMatchesList();

    if (isLoading) {
        return <div className="matches-loading">Načítám zápasy...</div>;
    }

    if (error !== '') {
        return <div className="matches-error">{error}</div>;
    }

    let pendingMatches = [];
    let activeMatches = [];
    let pastMatches = [];

    for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        if (m.status === MatchStatus.Pending) {
            pendingMatches.push(m);
        } else if (m.status === MatchStatus.Accepted || m.status === MatchStatus.InProgress) {
            activeMatches.push(m);
        } else {
            pastMatches.push(m);
        }
    }

    const renderMatchList = (list: MatchResponseDto[], emptyMessage: string) => {
        if (list.length === 0) {
            return <p className="empty-message">{emptyMessage}</p>;
        }

        let output = [];
        for (let i = 0; i < list.length; i++) {
            const m = list[i];
            output.push(
                <Link href={`/Dashboard/Matches/${m.id}`} key={m.id} className="match-card glass-card-dark">
                    <div className="match-card-header">
                        <span className={`status-badge ${m.status.toLowerCase()}`}>{m.status}</span>
                        <span className="match-date">{new Date(m.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="match-teams-display">
                        <div className="team-name">{m.homeTeamName}</div>
                        <div className="vs-text">VS</div>
                        <div className="team-name">{m.awayTeamName}</div>
                    </div>
                    <div className="match-location">{m.location}</div>
                </Link>
            );
        }
        return <div className="matches-grid">{output}</div>;
    };

    return (
        <div className="matches-page-container">
            <div className="matches-header">
                <h1 className="dashboard-heading">Zápasy</h1>
                <Link href="/Dashboard/Matches/Create" className="btn-primary">
                    + Navrhnout zápas
                </Link>
            </div>

            <div className="matches-section">
                <h2 className="section-title text-warning">Nové pozvánky (Pending)</h2>
                {renderMatchList(pendingMatches, "Nemáte žádné nevyřízené pozvánky.")}
            </div>

            <div className="matches-section">
                <h2 className="section-title text-success">Aktivní zápasy</h2>
                {renderMatchList(activeMatches, "Nemáte žádné aktivní nebo schválené zápasy.")}
            </div>

            <div className="matches-section">
                <h2 className="section-title text-muted">Historie zápasů</h2>
                {renderMatchList(pastMatches, "Historie zápasů je prázdná.")}
            </div>
        </div>
    );
}