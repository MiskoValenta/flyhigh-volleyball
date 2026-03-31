'use client';

import React from "react";
import { useCreateMatch } from "@/hooks/Matches/useCreateMatch";
import { useTeamsList } from "@/hooks/Teams/useTeamList";
import "./CreateMatch.css";

export default function CreateMatchPage() {
    const { formData, error, isLoading, handleChange, handleSubmit } = useCreateMatch();
    const { teams } = useTeamsList();

    return (
        <div className="CreateMatchContainer">
            <div className="CreateMatchCard">
                <h1 className="CreateMatchTitle">Navrhnout nový zápas</h1>

                {error && <div className="ErrorMessage">{error}</div>}

                <form className="CreateMatchForm" onSubmit={handleSubmit}>
                    <div className="FormGroup">
                        <label className="FormLabel">Tvůj tým (Domácí)</label>
                        <select
                            name="homeTeamId"
                            className="FormSelect"
                            value={formData.homeTeamId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Vyberte --</option>
                            {teams.map(t => (
                                <option key={t.id} value={t.id}>{t.teamName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="FormGroup">
                        <label className="FormLabel">Tým soupeře (ID Hostů)</label>
                        <input
                            type="text"
                            name="awayTeamId"
                            className="FormInput"
                            placeholder="Zadejte unikátní ID týmu"
                            value={formData.awayTeamId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="FormGroup">
                        <label className="FormLabel">Datum a čas výhozu</label>
                        <input
                            type="datetime-local"
                            name="scheduledAt"
                            className="FormInput"
                            value={formData.scheduledAt}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="FormGroup">
                        <label className="FormLabel">Místo konání (Hala)</label>
                        <input
                            type="text"
                            name="location"
                            className="FormInput"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="SubmitButton" disabled={isLoading}>
                        {isLoading ? 'Odesílám...' : 'Navrhnout zápas soupeři'}
                    </button>
                </form>
            </div>
        </div>
    );
}