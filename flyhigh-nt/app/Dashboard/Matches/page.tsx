"use client";

import React from "react";
import Link from "next/link";
import { useMatchesList } from "../../../hooks/Matches/useMatchesList";
import { MatchStatus } from "../../../types/match";
import {
    IoAddOutline,
    IoCheckmarkOutline,
    IoCloseOutline,
    IoCalendarClearOutline,
    IoLocationOutline,
    IoPlayCircleOutline,
    IoTrophyOutline
} from "react-icons/io5";
import "./Matches.css";

export default function MatchesPage() {
    const { matches, isLoading, error, handleAccept, handleReject } = useMatchesList();

    if (isLoading) return <div className="loading-state">Načítání zápasů...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const pending = matches.filter(m => m.status === MatchStatus.Pending);
    const active = matches.filter(m => [MatchStatus.Accepted, MatchStatus.InProgress].includes(m.status));
    const history = matches.filter(m => [MatchStatus.Finished, MatchStatus.Cancelled].includes(m.status));

    return (
        <div className="matches-wrapper">
            <div className="matches-header">
                <h1 className="dashboard-heading">Zápasy a výzvy</h1>
                <Link href="/Dashboard/Matches/Create" className="button-primary btn-new-match">
                    <IoAddOutline className="btn-icon" />
                    <span>Nová výzva</span>
                </Link>
            </div>

            {pending.length > 0 && (
                <section className="matches-section">
                    <h3 className="section-title">Čekající výzvy</h3>
                    <div className="matches-grid">
                        {pending.map(m => (
                            <div key={m.id} className="match-card glass-card-dark border-accent-warning">
                                <div className="match-card-teams">
                                    {m.homeTeamName} <span className="text-muted">vs</span> {m.awayTeamName}
                                </div>
                                <div className="match-card-detail">
                                    <IoCalendarClearOutline className="detail-icon" />
                                    <span>{new Date(m.date).toLocaleString()}</span>
                                </div>
                                <div className="match-actions">
                                    <button onClick={() => handleAccept(m.id)} className="btn-action btn-accept">
                                        <IoCheckmarkOutline className="action-icon" /> Přijmout
                                    </button>
                                    <button onClick={() => handleReject(m.id)} className="btn-action btn-reject">
                                        <IoCloseOutline className="action-icon" /> Odmítnout
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="matches-section">
                <h3 className="section-title">Aktivní zápasy</h3>
                <div className="matches-grid">
                    {active.map(m => (
                        <Link
                            href={m.status === MatchStatus.InProgress ? `/Dashboard/Matches/${m.id}/Live` : `/Dashboard/Matches/${m.id}`}
                            key={m.id}
                            className="match-card match-card-link glass-card-dark"
                        >
                            <span className={`status-badge status-${m.status}`}>
                                {m.status === MatchStatus.InProgress ? <><IoPlayCircleOutline className="badge-icon pulse-anim" /> LIVE</> : "Naplánováno"}
                            </span>
                            <div className="match-card-teams">
                                {m.homeTeamName} <span className="text-muted">vs</span> {m.awayTeamName}
                            </div>
                            <div className="match-card-detail">
                                <IoCalendarClearOutline className="detail-icon" />
                                <span>{new Date(m.date).toLocaleString()}</span>
                            </div>
                            {m.location && (
                                <div className="match-card-detail">
                                    <IoLocationOutline className="detail-icon" />
                                    <span>{m.location}</span>
                                </div>
                            )}
                        </Link>
                    ))}
                    {active.length === 0 && <p className="empty-text">Žádné aktivní zápasy. Vytvořte novou výzvu!</p>}
                </div>
            </section>

            <section className="matches-section">
                <h3 className="section-title">Historie</h3>
                <div className="matches-grid history-grid">
                    {history.map(m => (
                        <Link href={`/Dashboard/Matches/${m.id}`} key={m.id} className="match-card match-card-link glass-card-dark opacity-hover">
                            <span className="status-badge status-history">
                                <IoTrophyOutline className="badge-icon" /> {MatchStatus[m.status]}
                            </span>
                            <div className="match-card-teams">
                                {m.homeTeamName} <span className="text-muted">vs</span> {m.awayTeamName}
                            </div>
                            <div className="match-card-detail">
                                <IoCalendarClearOutline className="detail-icon" />
                                <span>{new Date(m.date).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}