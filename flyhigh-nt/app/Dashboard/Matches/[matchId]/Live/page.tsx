'use client';

import React, { use, useState } from "react";
import { useMatchDetail } from "@/hooks/Matches/useMatchDetail";
import { useLiveMatch } from "@/hooks/Matches/useLiveMatch";
import { MatchStatus, PlayerPosition, SetSide, SetWinner, SetType } from "@/types/match";
import "./Live.css";

export default function LiveMatchPage({ params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = use(params);
    const { match, currentUserId, isLoading, error, refreshMatch } = useMatchDetail(matchId);
    const { isLiveLoading, handleStartCurrentSet, handleAssignPosition, handleAddPoint } = useLiveMatch(matchId, refreshMatch);

    const [tempPositions, setTempPositions] = useState<Record<string, PlayerPosition>>({});

    if (isLoading) {
        return <div className="live-match-loading">Načítám LIVE přenos zápasu...</div>;
    }

    if (error !== "") {
        return <div className="live-match-error">{error}</div>;
    }

    if (match === null) {
        return <div className="live-match-error">Zápas nebyl nalezen.</div>;
    }

    if (match.status !== MatchStatus.InProgress) {
        return <div className="live-match-error">Zápas momentálně neprobíhá (In Progress).</div>;
    }

    let isCreator = false;
    if (match.creatorId === currentUserId) {
        isCreator = true;
    }

    const currentSet = match.sets[match.sets.length - 1];

    const submitStartSet = async (e: React.FormEvent) => {
        e.preventDefault();

        const playerIds = Object.keys(tempPositions);
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            const position = tempPositions[playerId];
            await handleAssignPosition(currentSet.setNumber, playerId, position);
        }

        await handleStartCurrentSet();
        setTempPositions({});
    };

    let liveSection = null;

    if (!currentSet.isStarted) {
        if (isCreator) {
            let homeRosterOptions = [];
            let awayRosterOptions = [];

            const positionOptions = [
                <option key={PlayerPosition.Bench} value={PlayerPosition.Bench}>Střídačka (Bench)</option>,
                <option key={PlayerPosition.Setter} value={PlayerPosition.Setter}>Nahrávač (Setter)</option>,
                <option key={PlayerPosition.OppositeHitter} value={PlayerPosition.OppositeHitter}>Univerzál (Opposite Hitter)</option>,
                <option key={PlayerPosition.Blocker} value={PlayerPosition.Blocker}>Blokař (Blocker)</option>,
                <option key={PlayerPosition.OutsideHitter} value={PlayerPosition.OutsideHitter}>Smečař (Outside Hitter)</option>,
                <option key={PlayerPosition.Libero} value={PlayerPosition.Libero}>Libero (Libero)</option>
            ];

            for (let i = 0; i < match.roster.length; i++) {
                const player = match.roster[i];
                const playerId = player.teamMemberId;

                let currentVal = PlayerPosition.Bench;
                if (tempPositions[playerId]) {
                    currentVal = tempPositions[playerId];
                }

                const selectElement = (
                    <div key={playerId} className="position-select-item">
                        <span className="roster-jersey">#{player.jerseyNumber}</span>
                        <span className="roster-id">{playerId}</span>
                        <select
                            value={currentVal}
                            onChange={(e) => setTempPositions(prev => ({ ...prev, [playerId]: e.target.value as PlayerPosition }))}
                            className="RoleSelect"
                        >
                            {positionOptions}
                        </select>
                    </div>
                );

                if (player.teamId === match.homeTeamId) {
                    homeRosterOptions.push(selectElement);
                } else if (player.teamId === match.awayTeamId) {
                    awayRosterOptions.push(selectElement);
                }
            }

            let startButtonText = "Potvrdit a odstartovat " + currentSet.setNumber + ". set";
            if (isLiveLoading) {
                startButtonText = "Ukládám a startuji...";
            }

            liveSection = (
                <div className="live-creator-setup glass-card-dark">
                    <h3 className="section-title">Nastavení soupisky pro {currentSet.setNumber}. set</h3>
                    <form onSubmit={submitStartSet}>
                        <div className="rosters-setup-container">
                            <div className="roster-setup-box">
                                <h4 className="form-title">{match.homeTeamName} (Domácí)</h4>
                                <div className="roster-select-list">
                                    {homeRosterOptions}
                                </div>
                            </div>
                            <div className="roster-setup-box">
                                <h4 className="form-title">{match.awayTeamName} (Hosté)</h4>
                                <div className="roster-select-list">
                                    {awayRosterOptions}
                                </div>
                            </div>
                        </div>
                        <div className="form-actions-live">
                            <button type="submit" className="btn-success start-set-btn" disabled={isLiveLoading}>
                                {startButtonText}
                            </button>
                        </div>
                    </form>
                </div>
            );
        } else {
            liveSection = (
                <div className="live-spectator-waiting glass-card-dark">
                    <h3 className="section-title">Čeká se na odstartování setu</h3>
                    <p className="info-text">Zakladatel zápasu momentálně přiřazuje role hráčům pro {currentSet.setNumber}. set.</p>
                </div>
            );
        }
    } else if (currentSet.isStarted) {
        if (!currentSet.isFinished) {
            let liveHomeRoster = [];
            let liveAwayRoster = [];

            for (let i = 0; i < match.roster.length; i++) {
                const player = match.roster[i];
                const playerId = player.teamMemberId;

                let playerPosition = PlayerPosition.Bench;
                if (currentSet.positions) {
                    const foundPos = currentSet.positions.find(p => p.teamMemberId === playerId);
                    if (foundPos) {
                        playerPosition = foundPos.position;
                    }
                }

                let translatedPosition = "Střídačka";
                if (playerPosition === PlayerPosition.Setter) { translatedPosition = "Nahrávač"; }
                else if (playerPosition === PlayerPosition.OppositeHitter) { translatedPosition = "Univerzál"; }
                else if (playerPosition === PlayerPosition.Blocker) { translatedPosition = "Blokař"; }
                else if (playerPosition === PlayerPosition.OutsideHitter) { translatedPosition = "Smečař"; }
                else if (playerPosition === PlayerPosition.Libero) { translatedPosition = "Libero"; }

                let playerItemClass = "live-player-item";
                if (playerPosition === PlayerPosition.Bench) {
                    playerItemClass = "live-player-item bench";
                }

                const playerElement = (
                    <li key={playerId} className={playerItemClass}>
                        <span className="live-player-jersey">#{player.jerseyNumber}</span>
                        <span className="live-player-id">{playerId}</span>
                        <span className="live-player-position">{translatedPosition}</span>
                    </li>
                );

                if (player.teamId === match.homeTeamId) {
                    liveHomeRoster.push(playerElement);
                } else if (player.teamId === match.awayTeamId) {
                    liveAwayRoster.push(playerElement);
                }
            }

            let liveCreatorControls = null;
            if (isCreator) {
                liveCreatorControls = (
                    <div className="live-creator-controls glass-card-dark">
                        <h3 className="section-title">Ovládání zápasu (Zakladatel)</h3>
                        <div className="controls-group">
                            <div className="team-control-box">
                                <h4>{match.homeTeamName}</h4>
                                <button className="btn-success point-btn" onClick={() => handleAddPoint(SetSide.Home)} disabled={isLiveLoading}>
                                    Přidat bod (+)
                                </button>
                            </div>
                            <div className="team-control-box">
                                <h4>{match.awayTeamName}</h4>
                                <button className="btn-success point-btn" onClick={() => handleAddPoint(SetSide.Away)} disabled={isLiveLoading}>
                                    Přidat bod (+)
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }

            liveSection = (
                <>
                    <div className="live-game-view">
                        <div className="live-roster glass-card-dark">
                            <h4 className="section-title">Rostery: {match.homeTeamName}</h4>
                            <ul className="live-roster-list">
                                {liveHomeRoster}
                            </ul>
                        </div>
                        <div className="live-roster glass-card-dark">
                            <h4 className="section-title">Rostery: {match.awayTeamName}</h4>
                            <ul className="live-roster-list">
                                {liveAwayRoster}
                            </ul>
                        </div>
                    </div>
                    {liveCreatorControls}
                </>
            );
        }
    }

    if (currentSet.isFinished) {
        let setWinnerName = "Neznámý tým";
        if (currentSet.winner === SetWinner.Home) { setWinnerName = match.homeTeamName; }
        else if (currentSet.winner === SetWinner.Away) { setWinnerName = match.awayTeamName; }

        let finishedSetControls = null;
        if (isCreator) {
            let continueText = "Pokračovat k dalšímu setu";
            if (isLiveLoading) {
                continueText = "Načítám další set...";
            }
            finishedSetControls = (
                <button className="btn-primary continue-match-btn" onClick={refreshMatch} disabled={isLiveLoading}>
                    {continueText}
                </button>
            );
        } else {
            finishedSetControls = <p className="info-text">Čeká se na pokračování k dalšímu setu zakladatelem.</p>;
        }

        liveSection = (
            <div className="live-set-finished glass-card-dark">
                <h3 className="finished-title">{currentSet.setNumber}. Set byl ukončen!</h3>
                <div className="finished-result">
                    <span className="winner-team">{setWinnerName}</span>
                    <span className="win-text">vyhrál tento set</span>
                    <span className="finished-score">{currentSet.homeScore} : {currentSet.awayScore}</span>
                </div>
                {finishedSetControls}
            </div>
        );
    }

    let completedSetsList = [];
    let homeSetsCount = 0;
    let awaySetsCount = 0;

    for (let i = 0; i < match.sets.length - 1; i++) {
        const s = match.sets[i];
        if (s.isFinished) {
            let winnerClassStr = "set-winner none";
            if (s.winner === SetWinner.Home) { winnerClassStr = "set-winner home"; }
            else if (s.winner === SetWinner.Away) { winnerClassStr = "set-winner away"; }

            completedSetsList.push(
                <li key={s.setNumber} className="completed-set-item">
                    <span className="set-num">{s.setNumber}. set:</span>
                    <span className="set-score">{s.homeScore} : {s.awayScore}</span>
                    <span className={winnerClassStr}>{s.winner}</span>
                </li>
            );
            if (s.winner === SetWinner.Home) { homeSetsCount++; }
            else if (s.winner === SetWinner.Away) { awaySetsCount++; }
        }
    }

    if (completedSetsList.length === 0) {
        completedSetsList.push(<li key="empty-sets" className="completed-set-item empty">Zatím žádné odehrané sety</li>);
    }

    let setTypeStr = "Set";
    if (currentSet.type === SetType.TieBreak) {
        setTypeStr = "Tie-Break";
    }

    let scoreStatusStr = "Aktuální stav setu";
    if (currentSet.isFinished) {
        scoreStatusStr = "Konečný stav setu";
    }

    return (
        <div className="live-match-page">
            <div className="live-header glass-card-dark">
                <div className="live-header-top">
                    <h1 className="live-heading">LIVE Přenos Zápasu</h1>
                    <span className="live-badge">InProgress</span>
                </div>
                <div className="live-scoreboard-main">
                    <div className="team home-team">
                        <h2>{match.homeTeamName}</h2>
                        <span className="set-score-big">{homeSetsCount}</span>
                    </div>
                    <div className="vs-badge-big">:</div>
                    <div className="team away-team">
                        <h2>{match.awayTeamName}</h2>
                        <span className="set-score-big">{awaySetsCount}</span>
                    </div>
                </div>
                <div className="live-current-set-score">
                    <span className="set-type">({currentSet.setNumber}. {setTypeStr})</span>
                    <span className="current-score-text">{scoreStatusStr}:</span>
                    <span className="current-score-nums">{currentSet.homeScore} : {currentSet.awayScore}</span>
                </div>
                <div className="match-meta">
                    <p><strong>Místo:</strong> {match.location}</p>
                    <p><strong>Zahájeno:</strong> {new Date(match.scheduledAt).toLocaleString()}</p>
                </div>
            </div>

            {liveSection}

            <div className="live-completed-sets glass-card-dark">
                <h3 className="section-title">Odehrané sety</h3>
                <ul className="completed-sets-list">
                    {completedSetsList}
                </ul>
            </div>
        </div>
    );
}