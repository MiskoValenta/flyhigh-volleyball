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
                <h1 className="dashboard-heading">Navrhnout nový zápas</h1>

                {error && <div className="ErrorMessage">{error}</div>}

                <form className="match-form-container glass-card-dark" onSubmit={handleSubmit}>
                    <div className="form-group-cm">
                        <label className="form-label-cm">Tvůj tým (Domácí)</label>
                        <select
                            name="homeTeamId"
                            className="form-input-cm"
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
                    <div className="form-group-cm">
                        <label className="form-label-cm">Tým soupeře (ID Hostů)</label>
                        <input
                            type="text"
                            name="awayTeamId"
                            className="form-input-cm"
                            placeholder="Zadejte unikátní ID týmu"
                            value={formData.awayTeamId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-cm">
                        <label className="form-label-cm">Datum a čas výhozu</label>
                        <input
                            type="datetime-local"
                            name="scheduledAt"
                            className="form-input-cm"
                            value={formData.scheduledAt}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-cm">
                        <label className="form-label-cm">Místo konání (Hala)</label>
                        <input
                            type="text"
                            name="location"
                            className="form-input-cm"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="button-primary" disabled={isLoading}>
                        {isLoading ? 'Odesílám...' : 'Navrhnout zápas soupeři'}
                    </button>
                </form>
            </div>
        </div>
    );
}