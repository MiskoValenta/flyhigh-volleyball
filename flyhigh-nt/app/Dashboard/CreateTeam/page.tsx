'use client';

import React from 'react';
import { useCreateTeam } from '@/hooks/Teams/useCreateTeam';
import './CreateTeam.css';

export default function CreateTeamPage() {
    const { formData, error, isLoading, handleChange, handleSubmit } = useCreateTeam();

    return (
        <div className="create-team-container">
            <h1 className="dashboard-heading">Založit nový tým</h1>

            {error && <div className="error-message">{error}</div>}

            <form className="create-team-form glass-card-dark" onSubmit={handleSubmit}>
                <div className="form-group-ct">
                    <label>Název týmu</label>
                    <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group-ct">
                    <label>Zkratka (např. FLY)</label>
                    <input
                        type="text"
                        name="shortName"
                        value={formData.shortName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group-ct">
                    <label>Popis (volitelné)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
                <div className="form-actions-ct">
                    <button type="submit" className="button-primary" disabled={isLoading}>
                        {isLoading ? 'Vytvářím tým...' : 'Založit tým'}
                    </button>
                </div>
            </form>
        </div>
    );
}