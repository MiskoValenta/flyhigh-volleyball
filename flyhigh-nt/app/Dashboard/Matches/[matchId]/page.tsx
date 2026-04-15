"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatchDetail } from '@/hooks/Matches/useMatchDetail';
import { useProfile } from '@/hooks/Profile/useProfile';
import { useTeamDetail } from '@/hooks/Teams/useTeamDetail';
import { MatchStatus, PlayerPosition } from '@/types/match';
import './MatchDetail.css';

export default function MatchDetailPage() {
    const { matchId } = useParams();
    const router = useRouter();
    const { user } = useProfile();
    const {
        match, loading, error, actionLoading,
        acceptMatch, rejectMatch, cancelMatch, addToRoster
    } = useMatchDetail(matchId as string);

    if (loading)
        return <div className="loading-md">Načítání detailu...</div>;

    if (error || !match)
        return <div className="error-md">{error || 'Zápas nenalezen.'}</div>;

    const isCreator = match.homeTeamId;

    return (
        <div className="container-md">
            <button onClick={() => router.back()} className="back-btn-md">← Zpět</button>

            <header className="header-md">
                <h1>Detail zápasu</h1>
                <div className={`status-badge-md status-${match.status.toLowerCase()}-md`}>
                    {match.status}
                </div>
            </header>

            <div className="main-grid-md">
                <section className="info-card-md">
                    <h3>Základní informace</h3>
                    <p><strong>Místo:</strong> {match.location}</p>
                    <p><strong>Datum:</strong> {new Date(match.scheduledDate).toLocaleString('cs-CZ')}</p>

                    {match.status === MatchStatus.Pending && (
                        <div className="pending-actions-md">
                            <p className="notice-md">Tento zápas čeká na potvrzení soupeřem.</p>
                            <button onClick={acceptMatch} disabled={actionLoading} className="btn-primary-md">Přijmout zápas</button>
                            <button onClick={rejectMatch} disabled={actionLoading} className="btn-danger-md">Odmítnout</button>
                        </div>
                    )}

                    {match.status === MatchStatus.Accepted && (
                        <div className="creator-actions-md">
                            <button className="btn-start-md">Zahájit zápas</button>
                            <button onClick={cancelMatch} className="btn-cancel-md">Zrušit zápas</button>
                        </div>
                    )}
                </section>

                {match.status !== MatchStatus.Pending && (
                    <>
                        <RosterSection
                            title="Domácí Tým"
                            roster={match.roster.filter(r => r.teamId === match.homeTeamId)}
                            teamId={match.homeTeamId}
                            matchId={match.id}
                            onAdd={addToRoster}
                        />
                        <RosterSection
                            title="Hostující Tým"
                            roster={match.roster.filter(r => r.teamId === match.awayTeamId)}
                            teamId={match.awayTeamId}
                            matchId={match.id}
                            onAdd={addToRoster}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function RosterSection({ title, roster, teamId, matchId, onAdd }: any) {
    const [jersey, setJersey] = useState('');
    const [userId, setUserId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ userId, jerseyNumber: parseInt(jersey) });
    };

    return (
        <section className="roster-card-md">
            <h3>{title}</h3>
            <ul className="roster-list-md">
                {roster.length === 0 ? <li className="empty-li-md">Soupiska je prázdná</li> :
                    roster.map((p: any, i: number) => (
                        <li key={i} className="player-item-md">
                            <span className="jersey-md">#{p.jerseyNumber}</span>
                            <span className="player-name-md">{p.userId}</span> 
                        </li>
                    ))
                }
            </ul>

            <form onSubmit={handleSubmit} className="roster-form-md">
                <input
                    type="text"
                    placeholder="ID Hráče"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="input-md"
                />
                <input
                    type="number"
                    placeholder="Číslo dresu"
                    value={jersey}
                    onChange={(e) => setJersey(e.target.value)}
                    className="input-md"
                />
                <button type="submit" className="btn-add-md">Přidat na soupisku</button>
            </form>
        </section>
    );
}