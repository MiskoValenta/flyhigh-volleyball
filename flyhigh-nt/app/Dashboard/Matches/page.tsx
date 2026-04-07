"use client";

import React from "react";
import Link from "next/link";
import { useMatchesList } from "@/hooks/Matches/useMatchesList";
import { acceptMatch, rejectMatch } from "@/lib/matchApi";
import "./Matches.css";

export default function MatchesPage() {
    const { activeMatches, pendingMatches, isLoading, error, refetch } = useMatchesList();

    const handleAccept = async (matchId: string) => {
        try {
            await acceptMatch(matchId);
            await refetch();
        } catch (err: any) {
            alert("Chyba při přijímání zápasu.");
        }
    };

    const handleReject = async (matchId: string) => {
        try {
            await rejectMatch(matchId);
            await refetch();
        } catch (err: any) {
            alert("Chyba při odmítání zápasu.");
        }
    };

    if (isLoading) {
        return <div className="matches-state-message">Načítám zápasy...</div>;
    }

    if (error !== "") {
        return <div className="matches-state-message match-error">Chyba: {error}</div>;
    }

    let pendingSection = null;
    if (pendingMatches.length > 0) {
        let pendingCards = [];
        for (let i = 0; i < pendingMatches.length; i++) {
            const match = pendingMatches[i];
            pendingCards.push(
                <div key={match.id} className="match-card pending-card glass-card-dark">
                    <div className="match-header">
                        <span className="match-badge">Pozvánka k zápasu</span>
                        <span className="match-date">{match.scheduledDate}</span>
                    </div>
                    <div className="match-teams">
                        <span className="team-id">ID Domácí: {match.homeTeamId}</span>
                        <span className="vs">VS</span>
                        <span className="team-id">ID Hosté: {match.awayTeamId}</span>
                    </div>
                    <div className="match-actions">
                        <button className="btn-accept" onClick={() => handleAccept(match.id)}>Přijmout</button>
                        <button className="btn-reject" onClick={() => handleReject(match.id)}>Odmítnout</button>
                    </div>
                </div>
            );
        }

        pendingSection = (
            <div className="pending-matches-section">
                <h2 className="dashboard-subheading">Čekající výzvy</h2>
                <div className="matches-grid">
                    {pendingCards}
                </div>
            </div>
        );
    }

    let activeCards = [];
    if (activeMatches.length > 0) {
        for (let i = 0; i < activeMatches.length; i++) {
            const match = activeMatches[i];

            let statusClass = "status-default";
            if (match.status === "InProgress") {
                statusClass = "status-in-progress";
            }
            if (match.status === "Finished") {
                statusClass = "status-finished";
            }

            activeCards.push(
                <Link key={match.id} href={`/Dashboard/Matches/${match.id}`} className="match-card glass-card-dark">
                    <div className="match-header">
                        <span className={`status-badge ${statusClass}`}>{match.status}</span>
                        <span className="match-date">{match.scheduledDate}</span>
                    </div>
                    <div className="match-score-row">
                        <div className="team-score">
                            <span className="score-number">{match.homeSetsWon}</span>
                            <span className="team-label">Domácí</span>
                        </div>
                        <div className="score-divider">:</div>
                        <div className="team-score">
                            <span className="score-number">{match.awaySetsWon}</span>
                            <span className="team-label">Hosté</span>
                        </div>
                    </div>
                    <div className="match-footer">Zobrazit detail zápasu</div>
                </Link>
            );
        }
    } else {
        activeCards.push(
            <div key="empty" className="matches-empty-state glass-card-dark">
                <p>Zatím nehrajete žádné zápasy.</p>
                <Link href="/Dashboard/Matches/Create" className="button-primary">
                    Vytvořit novou výzvu
                </Link>
            </div>
        );
    }

    return (
        <div className="matches-page-wrapper">
            {pendingSection}

            <div className="matches-page-header">
                <h1 className="dashboard-heading">Moje Zápasy</h1>
                <Link href="/Dashboard/Matches/Create" className="button-primary">
                    + Nový zápas
                </Link>
            </div>

            <div className="matches-grid">
                {activeCards}
            </div>
        </div>
    );
}