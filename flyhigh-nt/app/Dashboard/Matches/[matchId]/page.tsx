"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useMatchDetail } from "../../../../hooks/Matches/useMatchDetail";
import { useProfile } from "../../../../hooks/Profile/useProfile";
import { MatchStatus, SetSide } from "../../../../types/match";
import {
    IoArrowBack,
    IoPeopleOutline,
    IoPersonAddOutline,
    IoTrashOutline,
    IoPlayOutline
} from "react-icons/io5";
import "./MatchDetail.css";
import Link from "next/link";

export default function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = use(params);
    const router = useRouter();
    const { match, isLoading, error, handleAddRoster, handleRemoveRoster } = useMatchDetail(matchId);

    const { user } = useProfile();

    const [teamMemberId, setTeamMemberId] = useState("");
    const [jerseyNumber, setJerseyNumber] = useState("");
    const [teamSide, setTeamSide] = useState<SetSide>(SetSide.Home);

    if (isLoading || !match) return <div className="loading-state">Načítání detailu zápasu...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const isCreator = user?.id === match.creatorId;
    const isAccepted = match.status === MatchStatus.Accepted;

    const onAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleAddRoster({ teamSide, teamMemberId, jerseyNumber: Number(jerseyNumber) });
            setTeamMemberId("");
            setJerseyNumber("");
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="match-detail-wrapper-md">
            <div className="top-bar-md">
                <Link href="/Dashboard/Matches" className="btn-back-md">
                    <IoArrowBack className="back-icon-md" />
                    <span>Zpět na zápasy</span>
                </Link>
                {isCreator && isAccepted && (
                    <button onClick={() => router.push(`/Dashboard/Matches/${match.id}/Live`)} className="button-primary btn-start-md">
                        <IoPlayOutline className="play-icon-md" />
                        Přejít do LIVE režimu
                    </button>
                )}
            </div>

            <header className="header-card-md glass-card-dark">
                <div className="header-info-md">
                    <span className={`status-badge-md status-${match.status}`}>Status: {MatchStatus[match.status]}</span>
                    <h1>{match.homeTeamName} <span className="text-muted">vs</span> {match.awayTeamName}</h1>
                    <p className="location-md">Lokace: {match.location || "Nespecifikována"}</p>
                </div>
            </header>

            {isAccepted && (
                <div className="roster-section-md">
                    <div className="roster-form-card-md glass-card-dark">
                        <div className="form-header-md">
                            <IoPersonAddOutline className="form-icon-md" />
                            <h3>Přidat hráče na soupisku</h3>
                        </div>
                        <form onSubmit={onAddPlayer} className="roster-form-md">
                            <select value={teamSide} onChange={e => setTeamSide(e.target.value as SetSide)} className="input-md">
                                <option value={SetSide.Home}>Domácí ({match.homeTeamName})</option>
                                <option value={SetSide.Away}>Hosté ({match.awayTeamName})</option>
                            </select>
                            <input type="text" placeholder="ID člena týmu" required value={teamMemberId} onChange={e => setTeamMemberId(e.target.value)} className="input-md" />
                            <input type="number" placeholder="Číslo dresu" required value={jerseyNumber} onChange={e => setJerseyNumber(e.target.value)} className="input-md jersey-input" />
                            <button type="submit" className="button-primary btn-add-md">Přidat</button>
                        </form>
                    </div>

                    <div className="roster-grid-md">
                        <div className="roster-list-md glass-card-dark">
                            <div className="list-title-md">
                                <IoPeopleOutline className="team-icon-md home-icon" />
                                <h3>Domácí: {match.homeTeamName}</h3>
                            </div>
                            <ul className="player-list-md">
                                {match.rosters.filter(r => r.teamSide === SetSide.Home).map(r => (
                                    <li key={r.id} className="player-item-md">
                                        <span className="player-info-md">
                                            <span className="jersey-badge-md">#{r.jerseyNumber}</span> {r.userName}
                                        </span>
                                        <button onClick={() => handleRemoveRoster(r.id)} className="btn-remove-md" title="Odebrat">
                                            <IoTrashOutline />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="roster-list-md glass-card-dark">
                            <div className="list-title-md">
                                <IoPeopleOutline className="team-icon-md away-icon" />
                                <h3>Hosté: {match.awayTeamName}</h3>
                            </div>
                            <ul className="player-list-md">
                                {match.rosters.filter(r => r.teamSide === SetSide.Away).map(r => (
                                    <li key={r.id} className="player-item-md">
                                        <span className="player-info-md">
                                            <span className="jersey-badge-md">#{r.jerseyNumber}</span> {r.userName}
                                        </span>
                                        <button onClick={() => handleRemoveRoster(r.id)} className="btn-remove-md" title="Odebrat">
                                            <IoTrashOutline />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}