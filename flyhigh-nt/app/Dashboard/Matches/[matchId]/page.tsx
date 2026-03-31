'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useMatchDetail } from '@/hooks/Matches/useMatchDetail';
import './MatchDetail.css';

export default function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = use(params);
    const { match, error, isLoading, handleAccept, handleReject, handleCancel } = useMatchDetail(matchId);

    if (isLoading) return <div className="MatchDetailLoading">Načítám detail zápasu...</div>;
    if (error) return <div className="ErrorMessage">{error}</div>;
    if (!match) return <div className="ErrorMessage">Zápas nenalezen.</div>;

    return (
        <div className="MatchDetailContainer">
            <header className="MatchDetailHeader">
                <h1 className="MatchTitle">{match.homeTeamName} vs {match.awayTeamName}</h1>
                <span className={`StatusBadge ${match.status.toLowerCase()}`}>{match.status}</span>
            </header>

            <div className="MatchInfoCard">
                <p><strong>Lokace:</strong> {match.location}</p>
                <p><strong>Datum:</strong> {new Date(match.scheduledAt).toLocaleString('cs-CZ')}</p>
            </div>

            <div className="MatchActionsCard">
                {match.status === 'Proposed' && (
                    <div className="ActionButtons">
                        <button className="AcceptBtn" onClick={handleAccept}>Přijmout zápas</button>
                        <button className="RejectBtn" onClick={handleReject}>Odmítnout zápas</button>
                    </div>
                )}
                {match.status === 'Accepted' && (
                    <div className="ActionButtons">
                        <button className="CancelBtn" onClick={() => handleCancel('Zrušeno týmem')}>Zrušit zápas</button>
                        <Link href={`/Dashboard/Matches/${matchId}/Live`} className="LiveBtn">Přejít do Live SCOREBOARDU</Link>
                    </div>
                )}
            </div>

            <div className="MatchDataGrid">
                <div className="RosterSection">
                    <h2>Soupiska</h2>
                    {match.roster && match.roster.length > 0 ? (
                        <ul className="RosterList">
                            {match.roster.map(player => (
                                <li key={player.teamMemberId} className="RosterItem">
                                    Hráč ID: {player.teamMemberId} (Dres: <strong>{player.jerseyNumber}</strong>)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="EmptyText">Zatím nebyla přidána soupiska.</p>
                    )}
                </div>
            </div>
        </div>
    );
}