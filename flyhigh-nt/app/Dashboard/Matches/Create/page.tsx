"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreateMatch } from "../../../../hooks/Matches/useCreateMatch";
import { ProposeMatchDto } from "../../../../types/match";
import {
    IoArrowBack,
    IoCalendarOutline,
    IoLocationOutline,
    IoShieldHalfOutline,
    IoPersonOutline,
    IoTrophyOutline
} from "react-icons/io5";
import "./CreateMatch.css";

export default function CreateMatchPage() {
    const { handleCreate, isLoading, error } = useCreateMatch();
    const [opponentTeamId, setOpponentTeamId] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [refereeId, setRefereeId] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dto: ProposeMatchDto = {
            opponentTeamId,
            matchDate: new Date(date).toISOString(),
            location: location || undefined,
            refereeId: refereeId || undefined
        };
        handleCreate(dto);
    };

    return (
        <div className="create-match-wrapper-cm">
            <div className="top-bar-cm">
                <Link href="/Dashboard/Matches" className="btn-back-cm">
                    <IoArrowBack className="back-icon-cm" />
                    <span>Zpět na přehled</span>
                </Link>
            </div>

            <div className="create-card-cm glass-card-dark">
                <div className="card-header-cm">
                    <div className="icon-wrapper-cm">
                        <IoTrophyOutline className="header-icon-cm" />
                    </div>
                    <h2>Vyzvat tým k zápasu</h2>
                    <p>Navrhněte termín a místo. Soupeř musí výzvu potvrdit.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={onSubmit} className="create-form-cm">
                    <div className="form-group-cm">
                        <label>ID Soupeřova Týmu *</label>
                        <div className="input-with-icon-cm">
                            <IoShieldHalfOutline className="input-icon-cm" />
                            <input
                                type="text"
                                required
                                placeholder="Zadejte unikátní ID týmu"
                                value={opponentTeamId}
                                onChange={e => setOpponentTeamId(e.target.value)}
                                className="input-glass-cm"
                            />
                        </div>
                    </div>

                    <div className="form-group-cm">
                        <label>Datum a čas *</label>
                        <div className="input-with-icon-cm">
                            <IoCalendarOutline className="input-icon-cm" />
                            <input
                                type="datetime-local"
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="input-glass-cm"
                            />
                        </div>
                    </div>

                    <div className="form-group-cm">
                        <label>Místo konání</label>
                        <div className="input-with-icon-cm">
                            <IoLocationOutline className="input-icon-cm" />
                            <input
                                type="text"
                                placeholder="Název haly nebo adresa"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="input-glass-cm"
                            />
                        </div>
                    </div>

                    <div className="form-group-cm">
                        <label>Rozhodčí (volitelné)</label>
                        <div className="input-with-icon-cm">
                            <IoPersonOutline className="input-icon-cm" />
                            <input
                                type="text"
                                placeholder="ID uživatele (Rozhodčího)"
                                value={refereeId}
                                onChange={e => setRefereeId(e.target.value)}
                                className="input-glass-cm"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="button-primary submit-btn-cm">
                        {isLoading ? "Odesílám..." : "Odeslat výzvu"}
                    </button>
                </form>
            </div>
        </div>
    );
}