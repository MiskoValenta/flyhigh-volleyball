'use client';

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMatchDetail } from "@/hooks/Matches/useMatchDetail";
import { MatchStatus } from "@/types/match";
import "./MatchDetail.css";

export default function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = use(params);
    const router = useRouter();
    const {
        match,
        currentUserId,
        isLoading,
        error,
        handleAcceptMatch,
        handleRejectMatch,
        handleCancelMatch,
        handleAddRosterPlayer,
        handleSetReferee
    } = useMatchDetail(matchId);

    const [newHomePlayerId, setNewHomePlayerId] = useState("");
    const [newHomeJersey, setNewHomeJersey] = useState("");

    const [newAwayPlayerId, setNewAwayPlayerId] = useState("");
    const [newAwayJersey, setNewAwayJersey] = useState("");

    const [refereeId, setRefereeId] = useState("");
    const [cancelReason, setCancelReason] = useState("");

    if (isLoading) {
        return <div className="match-detail-loading">Načítám detail zápasu...</div>;
    }

    if (error !== "") {
        return <div className="match-detail-error">{error}</div>;
    }

    if (match === null) {
        return <div className="match-detail-error">Zápas nebyl nalezen.</div>;
    }

    const submitHomePlayer = (e: React.FormEvent) => {
        e.preventDefault();
        handleAddRosterPlayer(newHomePlayerId, match.homeTeamId, parseInt(newHomeJersey));
        setNewHomePlayerId("");
        setNewHomeJersey("");
    };

    const submitAwayPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        handleAddRosterPlayer(newAwayPlayerId, match.awayTeamId, parseInt(newAwayJersey));
        setNewAwayPlayerId("");
        setNewAwayJersey("");
    };

    const submitReferee = (e: React.FormEvent) => {
        e.preventDefault();
        handleSetReferee(refereeId);
        setRefereeId("");
    };

    const submitCancel = (e: React.FormEvent) => {
        e.preventDefault();
        handleCancelMatch(cancelReason);
        setCancelReason("");
    };

    let isCreator = false;
    if (match.creatorId === currentUserId) {
        isCreator = true;
    }

    let matchStatusText = "";
    if (match.status === MatchStatus.Pending) {
        matchStatusText = "Čeká na schválení (Pending)";
    } else if (match.status === MatchStatus.Accepted) {
        matchStatusText = "Schváleno (Accepted)";
    } else if (match.status === MatchStatus.Rejected) {
        matchStatusText = "Zamítnuto (Rejected)";
    } else if (match.status === MatchStatus.InProgress) {
        matchStatusText = "Probíhá (In Progress)";
    } else if (match.status === MatchStatus.Finished) {
        matchStatusText = "Ukončeno (Finished)";
    } else if (match.status === MatchStatus.Cancelled) {
        matchStatusText = "Zrušeno (Cancelled)";
    }

    let homeRosterList = [];
    let awayRosterList = [];

    for (let i = 0; i < match.roster.length; i++) {
        const player = match.roster[i];
        if (player.teamId === match.homeTeamId) {
            homeRosterList.push(
                <li key={player.teamMemberId} className="roster-item">
                    <span className="roster-jersey">#{player.jerseyNumber}</span>
                    <span className="roster-id">{player.teamMemberId}</span>
                </li>
            );
        } else if (player.teamId === match.awayTeamId) {
            awayRosterList.push(
                <li key={player.teamMemberId} className="roster-item">
                    <span className="roster-jersey">#{player.jerseyNumber}</span>
                    <span className="roster-id">{player.teamMemberId}</span>
                </li>
            );
        }
    }

    if (homeRosterList.length === 0) {
        homeRosterList.push(<li key="empty-home" className="roster-item empty">Zatím žádní hráči</li>);
    }
    if (awayRosterList.length === 0) {
        awayRosterList.push(<li key="empty-away" className="roster-item empty">Zatím žádní hráči</li>);
    }

    let actionsSection = null;
    let formsSection = null;

    if (match.status === MatchStatus.Pending) {
        actionsSection = (
            <div className="match-actions glass-card-dark">
                <h3 className="section-title">Akce k zápasu (Příjemce)</h3>
                <div className="button-group">
                    <button className="btn-success" onClick={handleAcceptMatch}>Přijmout zápas</button>
                    <button className="btn-danger" onClick={handleRejectMatch}>Odmítnout zápas</button>
                </div>
            </div>
        );
    } else if (match.status === MatchStatus.Accepted) {
        let creatorActions = null;
        if (isCreator) {
            creatorActions = (
                <div className="match-actions glass-card-dark">
                    <h3 className="section-title">Správa zápasu (Zakladatel)</h3>

                    <button className="btn-primary start-match-btn" onClick={() => router.push(`/Dashboard/Matches/${matchId}/Live`)}>
                        Přejít do LIVE správy zápasu
                    </button>

                    <form className="inline-form" onSubmit={submitReferee}>
                        <input
                            type="text"
                            placeholder="ID Rozhodčího (Volitelné)"
                            value={refereeId}
                            onChange={(e) => setRefereeId(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-secondary">Nastavit rozhodčího</button>
                    </form>

                    <form className="inline-form cancel-form" onSubmit={submitCancel}>
                        <input
                            type="text"
                            placeholder="Důvod zrušení"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-danger">Zrušit zápas</button>
                    </form>
                </div>
            );
        }

        formsSection = (
            <div className="roster-forms-container">
                <div className="roster-form glass-card-dark">
                    <h4 className="form-title">Přidat na soupisku (Domácí)</h4>
                    <form onSubmit={submitHomePlayer}>
                        <input type="text" placeholder="ID člena týmu" value={newHomePlayerId} onChange={(e) => setNewHomePlayerId(e.target.value)} required />
                        <input type="number" placeholder="Číslo dresu" value={newHomeJersey} onChange={(e) => setNewHomeJersey(e.target.value)} required min="1" max="99" />
                        <button type="submit" className="btn-primary">Přidat hráče</button>
                    </form>
                </div>

                <div className="roster-form glass-card-dark">
                    <h4 className="form-title">Přidat na soupisku (Hosté)</h4>
                    <form onSubmit={submitAwayPlayer}>
                        <input type="text" placeholder="ID člena týmu" value={newAwayPlayerId} onChange={(e) => setNewAwayPlayerId(e.target.value)} required />
                        <input type="number" placeholder="Číslo dresu" value={newAwayJersey} onChange={(e) => setNewAwayJersey(e.target.value)} required min="1" max="99" />
                        <button type="submit" className="btn-primary">Přidat hráče</button>
                    </form>
                </div>
            </div>
        );

        actionsSection = creatorActions;
    } else if (match.status === MatchStatus.InProgress) {
        if (isCreator) {
            actionsSection = (
                <div className="match-actions glass-card-dark">
                    <h3 className="section-title">Zápas právě probíhá</h3>
                    <button className="btn-primary start-match-btn" onClick={() => router.push(`/Dashboard/Matches/${matchId}/Live`)}>
                        Zpět do LIVE správy zápasu
                    </button>
                </div>
            );
        } else {
            actionsSection = (
                <div className="match-actions glass-card-dark">
                    <h3 className="section-title">Zápas právě probíhá</h3>
                    <p className="info-text">Tento zápas je momentálně řízen zakladatelem.</p>
                </div>
            );
        }
    }

    return (
        <div className="match-detail-page">
            <div className="match-header glass-card-dark">
                <div className="match-teams">
                    <div className="team home-team">
                        <h2>{match.homeTeamName}</h2>
                        <span className="team-label">Domácí</span>
                    </div>
                    <div className="vs-badge">VS</div>
                    <div className="team away-team">
                        <h2>{match.awayTeamName}</h2>
                        <span className="team-label">Hosté</span>
                    </div>
                </div>
                <div className="match-meta">
                    <p><strong>Datum:</strong> {new Date(match.scheduledAt).toLocaleString()}</p>
                    <p><strong>Místo:</strong> {match.location}</p>
                    <p><strong>Status:</strong> <span className={`status-badge ${match.status.toLowerCase()}`}>{matchStatusText}</span></p>
                </div>
            </div>

            {actionsSection}

            {formsSection}

            <div className="rosters-container">
                <div className="roster-box glass-card-dark">
                    <h3 className="section-title">Soupiska: {match.homeTeamName}</h3>
                    <ul className="roster-list">
                        {homeRosterList}
                    </ul>
                </div>
                <div className="roster-box glass-card-dark">
                    <h3 className="section-title">Soupiska: {match.awayTeamName}</h3>
                    <ul className="roster-list">
                        {awayRosterList}
                    </ul>
                </div>
            </div>
        </div>
    );
}