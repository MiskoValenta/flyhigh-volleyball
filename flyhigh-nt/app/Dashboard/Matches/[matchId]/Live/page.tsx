"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMatchDetail } from "@/hooks/Matches/useMatchDetail";
import { useLiveMatch } from "@/hooks/Matches/useLiveMatch";
import { PlayerPosition, SetSide } from "@/types/match";
import "./LiveMatch.css";

export default function LiveMatchPage() {
    const params = useParams();
    const matchId = params.matchId as string;

    const { match, isLoading: isDetailLoading, fetchMatch } = useMatchDetail(matchId);

    const {
        handleStartMatch,
        handleStartSet,
        handleAddPoint,
        handleAssignPosition,
        isLiveLoading
    } = useLiveMatch(matchId, fetchMatch);

    const [posPlayerId, setPosPlayerId] = useState("");
    const [posSelect, setPosSelect] = useState<PlayerPosition>(PlayerPosition.Setter);
    const [posSide, setPosSide] = useState<SetSide>(SetSide.Home);

    if (isDetailLoading) {
        return <div className="live-msg-live">Připojuji se k zápasu...</div>;
    }

    if (!match) {
        return <div className="live-msg-live error-live">Zápas nenalezen.</div>;
    }

    const submitPosition = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleAssignPosition({
                playerId: posPlayerId,
                position: posSelect,
                side: posSide
            });
            setPosPlayerId("");
            alert("Pozice uložena.");
        } catch (err) {
            alert("Chyba při ukládání pozice.");
        }
    };

    let activeSet = null;
    if (match.sets.length > 0) {
        for (let i = 0; i < match.sets.length; i++) {
            if (match.sets[i].isFinished === false) {
                activeSet = match.sets[i];
            }
        }

        if (activeSet === null) {
            activeSet = match.sets[match.sets.length - 1];
        }
    }

    let creatorControls = null;

    if (match.status === "Accepted") {
        creatorControls = (
            <div className="center-panel-live glass-card-dark">
                <h2>Vše je připraveno</h2>
                <button className="btn-huge-live" onClick={handleStartMatch} disabled={isLiveLoading}>
                    Odstartovat zápas
                </button>
            </div>
        );
    } else if (match.status === "InProgress" && activeSet) {
        if (activeSet.isFinished) {
            creatorControls = (
                <div className="center-panel-live glass-card-dark">
                    <h2>Set byl ukončen</h2>
                    <p>Systém zaregistroval konec setu (Vítěz: {activeSet.winner}).</p>
                    <button className="btn-huge-live" onClick={handleStartSet} disabled={isLiveLoading}>
                        Založit další set
                    </button>
                </div>
            );
        } else {
            let homePlayersOpts = [];
            homePlayersOpts.push(<option key="def" value="">Vyberte domácího hráče...</option>);
            for (let i = 0; i < match.homeRoster.length; i++) {
                homePlayersOpts.push(<option key={match.homeRoster[i].playerId} value={match.homeRoster[i].playerId}>{match.homeRoster[i].playerId}</option>);
            }

            let awayPlayersOpts = [];
            awayPlayersOpts.push(<option key="def" value="">Vyberte hostujícího hráče...</option>);
            for (let i = 0; i < match.awayRoster.length; i++) {
                awayPlayersOpts.push(<option key={match.awayRoster[i].playerId} value={match.awayRoster[i].playerId}>{match.awayRoster[i].playerId}</option>);
            }

            let currentPlayerOpts = homePlayersOpts;
            if (posSide === SetSide.Away) {
                currentPlayerOpts = awayPlayersOpts;
            }

            creatorControls = (
                <div className="live-controls-wrap-live">
                    <div className="position-box-live glass-card-dark">
                        <h3>Rozestavení hráčů na hřišti</h3>
                        <form onSubmit={submitPosition} className="pos-form-live">
                            <select value={posSide} onChange={(e) => setPosSide(e.target.value as SetSide)} className="input-live">
                                <option value={SetSide.Home}>Domácí</option>
                                <option value={SetSide.Away}>Hosté</option>
                            </select>
                            <select value={posPlayerId} onChange={(e) => setPosPlayerId(e.target.value)} className="input-live" required>
                                {currentPlayerOpts}
                            </select>
                            <select value={posSelect} onChange={(e) => setPosSelect(e.target.value as PlayerPosition)} className="input-live">
                                <option value={PlayerPosition.Setter}>Nahrávač</option>
                                <option value={PlayerPosition.OutsideHitter}>Smečař</option>
                                <option value={PlayerPosition.MiddleBlocker}>Blokař</option>
                                <option value={PlayerPosition.Opposite}>Univerzál</option>
                                <option value={PlayerPosition.Libero}>Libero</option>
                            </select>
                            <button type="submit" className="btn-save-pos-live">Nastavit</button>
                        </form>
                    </div>

                    <div className="scoring-box-live">
                        <button className="btn-point-live home-btn-live" onClick={() => handleAddPoint(SetSide.Home)} disabled={isLiveLoading}>
                            + BOD DOMÁCÍ
                        </button>
                        <button className="btn-point-live away-btn-live" onClick={() => handleAddPoint(SetSide.Away)} disabled={isLiveLoading}>
                            + BOD HOSTÉ
                        </button>
                    </div>
                </div>
            );
        }
    } else if (match.status === "Finished") {
        creatorControls = (
            <div className="center-panel-live glass-card-dark">
                <h2>Zápas skončil</h2>
                <p>Konečný výsledek: {match.homeSetsWon} : {match.awaySetsWon}</p>
            </div>
        );
    }

    let currentScoreBoard = null;
    if (activeSet) {
        currentScoreBoard = (
            <div className="scoreboard-live glass-card-dark">
                <div className="team-col-live">
                    <span className="team-name-live">DOMÁCÍ</span>
                    <span className="set-score-live">Sety: {match.homeSetsWon}</span>
                    <span className="big-point-live">{activeSet.homeScore}</span>
                </div>
                <div className="divider-live">:</div>
                <div className="team-col-live">
                    <span className="team-name-live">HOSTÉ</span>
                    <span className="set-score-live">Sety: {match.awaySetsWon}</span>
                    <span className="big-point-live">{activeSet.awayScore}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="live-wrapper-live">
            <div className="live-top-bar-live">
                <Link href={`/Dashboard/Matches/${match.id}`} className="btn-leave-live">Opustit Engine</Link>
                <div className="pulse-indicator-live">LIVE</div>
            </div>

            {currentScoreBoard}
            {creatorControls}
        </div>
    );
}