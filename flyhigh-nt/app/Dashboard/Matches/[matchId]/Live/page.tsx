"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLiveMatch } from '@/hooks/Matches/useLiveMatch';
import { MatchStatus, PlayerPosition, StartSetRequest } from '@/types/match';
import './LiveMatch.css';

const positionTranslations: Record<PlayerPosition, string> = {
    [PlayerPosition.Setter]: "Nahrávač",
    [PlayerPosition.OutsideHitter]: "Smečař",
    [PlayerPosition.MiddleBlocker]: "Blokař",
    [PlayerPosition.Opposite]: "Univerzál",
    [PlayerPosition.Libero]: "Libero",
    [PlayerPosition.Bench]: "Lavička"
};

export default function LiveMatchPage() {
    const { matchId } = useParams();
    const router = useRouter();
    const {
        match, loading, error, actionLoading,
        startNextSet, recordPoint
    } = useLiveMatch(matchId as string);

    const [setupPositions, setSetupPositions] = useState<Record<string, PlayerPosition>>({});

    useEffect(() => {
        if (match && match.roster) {
            const initialSetup: Record<string, PlayerPosition> = {};
            match.roster.forEach(player => {
                const key = `${player.teamId}_${player.userId}`;
                if (!setupPositions[key]) {
                    initialSetup[key] = PlayerPosition.Bench;
                }
            });
            if (Object.keys(initialSetup).length > 0) {
                setSetupPositions(prev => ({ ...prev, ...initialSetup }));
            }
        }
    }, [match]);

    if (loading && !match)
        return <div className="loading-lm">Načítání živého přenosu...</div>;

    if (error || !match)
        return <div className="error-lm">{error || 'Zápas nenalezen.'}</div>;

    const activeSet = match.sets.find(s => !s.isCompleted);
    const needsSetup = !activeSet && match.status !== MatchStatus.Finished && match.status !== MatchStatus.Cancelled;

    const handleStartSet = async () => {
        const payload: StartSetRequest = {
            playerPositions: Object.entries(setupPositions).map(([key, position]) => {
                const [teamId, userId] = key.split('_');
                return { teamId, userId, position };
            })
        };
        await startNextSet(payload);
    };

    const handlePositionChange = (teamId: string, userId: string, position: PlayerPosition) => {
        const key = `${teamId}_${userId}`;
        setSetupPositions(prev => ({ ...prev, [key]: position }));
    };

    return (
        <div className="container-lm">
            <button onClick={() => router.back()} className="back-btn-lm">← Zpět na detail</button>

            <div className="scoreboard-lm">
                <div className="team-score-lm">
                    <h2>Domácí</h2>
                    <div className="big-score-lm">{activeSet ? activeSet.homeTeamScore : '-'}</div>
                    <div className="sets-won-lm">Vyhrané sety: {match.homeSetsWon}</div>
                </div>
                <div className="score-divider-lm">
                    <span>{match.status === MatchStatus.Finished ? 'KONEC' : (activeSet ? `SET ${activeSet.setNumber}` : 'PŘÍPRAVA')}</span>
                </div>
                <div className="team-score-lm">
                    <h2>Hosté</h2>
                    <div className="big-score-lm">{activeSet ? activeSet.awayTeamScore : '-'}</div>
                    <div className="sets-won-lm">Vyhrané sety: {match.awaySetsWon}</div>
                </div>
            </div>

            {match.status === MatchStatus.Finished && (
                <div className="finished-banner-lm">
                    Zápas byl úspěšně dohrán. Vítěz dosáhl 3 vítězných setů.
                </div>
            )}

            {needsSetup && (
                <div className="setup-section-lm">
                    <h3 className="section-title-lm">Předzápasová příprava: Rozdělení pozic</h3>
                    <p className="hint-lm">Nastavte hráčům role pro nadcházející set. Hráči bez vybrané pozice zůstanou na lavičce.</p>

                    <div className="setup-grid-lm">
                        <div className="team-setup-lm">
                            <h4>Domácí Tým</h4>
                            {match.roster.filter(r => r.teamId === match.homeTeamId).map(player => (
                                <div key={player.userId} className="player-row-lm">
                                    <span className="jersey-lm">#{player.jerseyNumber}</span>
                                    <select
                                        className="position-select-lm"
                                        value={setupPositions[`${player.teamId}_${player.userId}`] || PlayerPosition.Bench}
                                        onChange={(e) => handlePositionChange(player.teamId, player.userId, e.target.value as PlayerPosition)}
                                    >
                                        {Object.values(PlayerPosition).map(pos => (
                                            <option key={pos} value={pos}>{positionTranslations[pos]}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="team-setup-lm">
                            <h4>Hostující Tým</h4>
                            {match.roster.filter(r => r.teamId === match.awayTeamId).map(player => (
                                <div key={player.userId} className="player-row-lm">
                                    <span className="jersey-lm">#{player.jerseyNumber}</span>
                                    <select
                                        className="position-select-lm"
                                        value={setupPositions[`${player.teamId}_${player.userId}`] || PlayerPosition.Bench}
                                        onChange={(e) => handlePositionChange(player.teamId, player.userId, e.target.value as PlayerPosition)}
                                    >
                                        {Object.values(PlayerPosition).map(pos => (
                                            <option key={pos} value={pos}>{positionTranslations[pos]}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStartSet}
                        disabled={actionLoading}
                        className="btn-start-set-lm"
                    >
                        {actionLoading ? 'Zahajuji...' : 'Zahájit Set'}
                    </button>
                </div>
            )}

            {activeSet && (
                <div className="live-controls-lm">
                    <h3 className="section-title-lm">Správa aktuálního setu</h3>
                    <div className="point-buttons-lm">
                        <button
                            onClick={() => recordPoint({ scoringTeamId: match.homeTeamId })}
                            disabled={actionLoading}
                            className="btn-point-lm btn-home-lm"
                        >
                            +1 Bod Domácí
                        </button>
                        <button
                            onClick={() => recordPoint({ scoringTeamId: match.awayTeamId })}
                            disabled={actionLoading}
                            className="btn-point-lm btn-away-lm"
                        >
                            +1 Bod Hosté
                        </button>
                    </div>
                    <p className="spectator-hint-lm">Pokud nejste zakladatel zápasu, tlačítka pro přidání bodu nebudou fungovat (přístup odepřen backendem). Obrazovka se pro diváky sama obnovuje každých 10 vteřin.</p>
                </div>
            )}
        </div>
    );
}