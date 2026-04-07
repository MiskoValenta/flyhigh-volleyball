"use client";

import React from "react";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { useMatchesList } from "@/hooks/Matches/useMatchesList";
import { acceptMatch, rejectMatch } from "@/lib/matchApi";
import "./Matches.css";

export default function MatchesPage() {
    const { activeMatches, pendingMatches, isLoading, error, refetch, profile } = useMatchesList();

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

            let actionsContent = null;
            let isCreator = false;

            if (profile) {
                if (profile.id === match.creatorId) {
                    isCreator = true;
                }
            }

            if (isCreator) {
                actionsContent = <p className="pending-waiting-text">Čeká se na přijetí soupeřem...</p>;
            } else {
                actionsContent = (
                    <div className="match-actions">
                        <button className="btn-accept" onClick={() => handleAccept(match.id)}>Přijmout</button>
                        <button className="btn-reject" onClick={() => handleReject(match.id)}>Odmítnout</button>
                    </div>
                );
            }

            let showDate = "Nenastaveno";
            if (match.scheduledDate) {
                const d = new Date(match.scheduledDate);
                showDate = d.toLocaleDateString("cs-CZ") + " " + d.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' });
            }

            pendingCards.push(
                <div key={match.id} className="match-card pending-card glass-card-dark">
                    <div className="match-card-top">
                        <span className="match-badge">Pozvánka</span>
                        <span className="match-date">{showDate}</span>
                    </div>
                    <div className="match-card-center">
                        <span className="team-name-full">{match.homeTeamName}</span>
                        <span className="vs-text">VS</span>
                        <span className="team-name-full">{match.awayTeamName}</span>
                    </div>
                    {actionsContent}
                </div>
            );
        }

        pendingSection = (
            <div className="pending-matches-section">
                <div className="matches-page-header">
                    <h1 className="dashboard-heading">Čekající výzvy</h1>
                </div>
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
            } else {
                if (match.status === "Finished") {
                    statusClass = "status-finished";
                }
            }

            let opponentName = match.awayTeamName;
            if (profile) {
                if (profile.id !== match.creatorId) {
                    opponentName = match.homeTeamName;
                }
            }

            let matchLocation = "Neuvedeno";
            if (match.location) {
                matchLocation = match.location;
            }

            let showDate = "Nenastaveno";
            if (match.scheduledDate) {
                const d = new Date(match.scheduledDate);
                showDate = d.toLocaleDateString("cs-CZ") + " " + d.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' });
            }

            activeCards.push(
                <Link key={match.id} href={`/Dashboard/Matches/${match.id}`} className="match-card glass-card-dark">

                    <div className="match-card-top">
                        <span className={`status-badge ${statusClass}`}>{match.status}</span>
                        <span className="match-date">{showDate}</span>
                    </div>

                    <div className="match-card-center-big">
                        <span className="team-abbr">{match.homeTeamAbbr}</span>
                        <span className="vs-divider">:</span>
                        <span className="team-abbr">{match.awayTeamAbbr}</span>
                    </div>

                    <div className="match-details-list">
                        <div className="detail-row">
                            <span className="detail-label">Vytvořil:</span>
                            <span className="detail-value">{match.creatorName}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Místo:</span>
                            <span className="detail-value">{matchLocation}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Soupeř:</span>
                            <span className="detail-value">{opponentName}</span>
                        </div>
                    </div>

                    <div className="match-card-footer">
                        <span className="show-more-text">
                            Zobrazit detail zápasu <IoChevronForward className="show-more-icon" />
                        </span>
                    </div>

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