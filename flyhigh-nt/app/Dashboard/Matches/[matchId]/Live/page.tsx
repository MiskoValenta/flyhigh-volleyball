'use client';

import React, { use } from "react";
import { useLiveMatch } from "@/hooks/Matches/useLiveMatch";
import { useMatchDetail } from "@/hooks/Matches/useMatchDetail";
import "./Live.css";

export default function LiveMatchPage({ params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = use(params);

    const { match, isLoading: isMatchLoading } = useMatchDetail(matchId);

    const { error, isLoading: isLiveLoading, handleStartMatch, handleStartSet, handleAddPoint } = useLiveMatch(matchId);

    if (isMatchLoading) return <div className="LiveLoading">Načítám scoreboard...</div>;
    if (!match) return <div className="ErrorMessage">Zápas nenalezen.</div>;

    const currentSet = match.sets && match.sets.length > 0 ? match.sets[match.sets.length - 1] : null;

    return (
        <div className="LiveContainer">
            <header className="LiveHeader">
                <h1 className="LiveTitle">LIVE: {match.homeTeamName} vs {match.awayTeamName}</h1>
                <span className="LiveStatusBadge">{match.status}</span>
            </header>

            {error && <div className="ErrorMessage">{error}</div>}

            <div className="ScoreboardCard">
                <div className="TeamScore">
                    <h2 className="TeamName">{match.homeTeamName}</h2>
                    <div className="PointsDisplay">{currentSet ? currentSet.homeScore : 0}</div>
                    <button
                        className="AddPointBtn"
                        onClick={() => handleAddPoint('Home')}
                        disabled={isLiveLoading || match.status !== 'InProgress'}
                    >
                        + Domácí Bod
                    </button>
                </div>

                <div className="ScoreDivider">:</div>

                <div className="TeamScore">
                    <h2 className="TeamName">{match.awayTeamName}</h2>
                    <div className="PointsDisplay">{currentSet ? currentSet.awayScore : 0}</div>
                    <button
                        className="AddPointBtn"
                        onClick={() => handleAddPoint('Away')}
                        disabled={isLiveLoading || match.status !== 'InProgress'}
                    >
                        + Hosté Bod
                    </button>
                </div>
            </div>

            <div className="MatchControls">
                {match.status === 'Accepted' && (
                    <button className="ControlBtn start" onClick={handleStartMatch} disabled={isLiveLoading}>
                        Odpískat začátek zápasu
                    </button>
                )}

                {match.status === 'InProgress' && (!currentSet || currentSet.isFinished) && (
                    <button className="ControlBtn set" onClick={handleStartSet} disabled={isLiveLoading}>
                        Odstartovat nový set
                    </button>
                )}
            </div>
        </div>
    );
}