"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useMatchDetail } from "../../../../../hooks/Matches/useMatchDetail";
import { useLiveMatch } from "../../../../../hooks/Matches/useLiveMatch";
import { useProfile } from "../../../../../hooks/Profile/useProfile";
import { MatchStatus, SetSide, PlayerPosition, SetPlayerPositionDto } from "../../../../../types/match";
import {
    IoArrowBack,
    IoPlayCircle,
    IoAddCircleOutline,
    IoStopwatchOutline,
    IoTrophyOutline
} from "react-icons/io5";
import "./LiveMatch.css";

export default function LiveMatchPage({ params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = use(params);
    const { match, isLoading, refetch } = useMatchDetail(matchId, true);
    const { handleStartMatch, handleStartNextSet, handleRecordPoint, isActionLoading } = useLiveMatch(matchId, refetch);

    const { user } = useProfile();

    const [positions, setPositions] = useState<Record<string, PlayerPosition>>({});

    if (isLoading && !match) return <div className="loading-state">Načítání LIVE přenosu...</div>;
    if (!match) return null;

    const isCreator = user?.id === match.creatorId;
    const activeSet = match.sets.find(s => s.endTime === null);
    const isSetRunning = !!activeSet;
    const canStartMatch = match.status === MatchStatus.Accepted && match.sets.length === 0;
    const isWaitingForSetStart = match.status === MatchStatus.InProgress && !isSetRunning;

    const onStartSet = () => {
        const dtoArray: SetPlayerPositionDto[] = Object.keys(positions).map(rosterEntryId => ({
            rosterEntryId,
            position: positions[rosterEntryId]
        }));
        handleStartNextSet({ positions: dtoArray });
    };

    return (
        <div className="live-wrapper-live">
            <div className="top-bar-live">
                <Link href={`/Dashboard/Matches/${match.id}`} className="btn-back-live">
                    <IoArrowBack className="back-icon-live" />
                    <span>Zpět na detail</span>
                </Link>
            </div>

            <header className="header-live glass-card-dark">
                <div className="pulse-badge-live">LIVE</div>
                <h1 className="match-title-live">{match.homeTeamName} <span className="text-muted">vs</span> {match.awayTeamName}</h1>
                <div className="status-text-live">{MatchStatus[match.status]}</div>
            </header>

            {!isCreator && isWaitingForSetStart && (
                <div className="waiting-banner-live glass-card-dark">
                    <IoStopwatchOutline className="waiting-icon-live" />
                    <h3>Čeká se na rozhodčího / trenéra...</h3>
                    <p>Probíhá přidělování herních rolí pro nadcházející set.</p>
                </div>
            )}

            {isCreator && canStartMatch && (
                <div className="action-panel-live glass-card-dark">
                    <IoTrophyOutline className="panel-icon-live" />
                    <h3>Zápas je připraven</h3>
                    <button onClick={handleStartMatch} disabled={isActionLoading} className="button-primary btn-huge-live">
                        <IoPlayCircle className="btn-icon-live" /> ODSTARTOVAT ZÁPAS
                    </button>
                </div>
            )}

            {isCreator && isWaitingForSetStart && (
                <div className="roster-setup-live glass-card-dark">
                    <h3>Nastavení rolí pro Set {match.sets.length + 1}</h3>
                    <div className="setup-grid-live">
                        <div className="setup-col-live">
                            <h4 className="team-col-title-home">{match.homeTeamName}</h4>
                            {match.rosters.filter(r => r.teamSide === SetSide.Home).map(r => (
                                <div key={r.id} className="setup-row-live">
                                    <span className="player-name-live">#{r.jerseyNumber} {r.userName}</span>
                                    <select
                                        className="select-live"
                                        value={positions[r.id] || PlayerPosition.Bench}
                                        onChange={e => setPositions({ ...positions, [r.id]: e.target.value as PlayerPosition })}
                                    >
                                        <option value={PlayerPosition.Bench}>Střídačka</option>
                                        <option value={PlayerPosition.Setter}>Nahrávač</option>
                                        <option value={PlayerPosition.Opposite}>Univerzál</option>
                                        <option value={PlayerPosition.MiddleBlocker}>Blokař</option>
                                        <option value={PlayerPosition.OutsideHitter}>Smečař</option>
                                        <option value={PlayerPosition.Libero}>Libero</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="setup-col-live">
                            <h4 className="team-col-title-away">{match.awayTeamName}</h4>
                            {match.rosters.filter(r => r.teamSide === SetSide.Away).map(r => (
                                <div key={r.id} className="setup-row-live">
                                    <span className="player-name-live">#{r.jerseyNumber} {r.userName}</span>
                                    <select
                                        className="select-live"
                                        value={positions[r.id] || PlayerPosition.Bench}
                                        onChange={e => setPositions({ ...positions, [r.id]: e.target.value as PlayerPosition })}
                                    >
                                        <option value={PlayerPosition.Bench}>Střídačka</option>
                                        <option value={PlayerPosition.Setter}>Nahrávač</option>
                                        <option value={PlayerPosition.Opposite}>Univerzál</option>
                                        <option value={PlayerPosition.MiddleBlocker}>Blokař</option>
                                        <option value={PlayerPosition.OutsideHitter}>Smečař</option>
                                        <option value={PlayerPosition.Libero}>Libero</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={onStartSet} disabled={isActionLoading} className="button-primary btn-full-live">
                        Potvrdit role a zahájit Set
                    </button>
                </div>
            )}

            {isSetRunning && activeSet && (
                <div className="scoreboard-live glass-card-dark">
                    <h3 className="set-title-live">Probíhá Set {activeSet.setNumber}</h3>
                    <div className="score-display-live">
                        <div className="score-box-live box-home">
                            <span className="team-name-live">{match.homeTeamName}</span>
                            <span className="points-live text-home">{activeSet.homeScore}</span>
                            {isCreator && (
                                <button onClick={() => handleRecordPoint({ teamSide: SetSide.Home, isPenalty: false })} disabled={isActionLoading} className="btn-point-live btn-point-home">
                                    <IoAddCircleOutline className="point-icon-live" /> Bod
                                </button>
                            )}
                        </div>
                        <div className="score-divider-live">:</div>
                        <div className="score-box-live box-away">
                            <span className="team-name-live">{match.awayTeamName}</span>
                            <span className="points-live text-away">{activeSet.awayScore}</span>
                            {isCreator && (
                                <button onClick={() => handleRecordPoint({ teamSide: SetSide.Away, isPenalty: false })} disabled={isActionLoading} className="btn-point-live btn-point-away">
                                    <IoAddCircleOutline className="point-icon-live" /> Bod
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {match.status === MatchStatus.Finished && (
                <div className="finished-banner-live glass-card-dark">
                    <IoTrophyOutline className="trophy-icon-live" />
                    <h2>ZÁPAS UKONČEN</h2>
                    <p>Vítěz: <strong>{match.sets[match.sets.length - 1]?.winnerSide === SetSide.Home ? match.homeTeamName : match.awayTeamName}</strong></p>
                </div>
            )}

            <div className="history-live glass-card-dark">
                <h3>Historie Setů</h3>
                {match.sets.map(s => (
                    <div key={s.id} className="history-item-live">
                        <span className="history-set-number">Set {s.setNumber}</span>
                        <strong className="history-score">{s.homeScore} : {s.awayScore}</strong>
                        <span className={`history-winner ${s.winnerSide ? 'has-winner' : 'ongoing'}`}>
                            {s.winnerSide ? (s.winnerSide === SetSide.Home ? match.homeTeamName : match.awayTeamName) : 'Probíhá'}
                        </span>
                    </div>
                ))}
                {match.sets.length === 0 && <p className="text-muted">Zatím nebyly odehrány žádné sety.</p>}
            </div>
        </div>
    );
}