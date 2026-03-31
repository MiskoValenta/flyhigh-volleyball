'use client';

import React from 'react';
import { useCreateTeam } from '@/hooks/Teams/useCreateTeam';
import './CreateTeam.css';

export default function CreateTeamPage() {
    const { formData, error, isLoading, handleChange, handleSubmit } = useCreateTeam();

    return (
        <div className="create-team-container">
            <h1>Založit nový tým</h1>

            {error && <div className="error-message">{error}</div>}

            <form className="create-team-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Název týmu</label>
                    <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Zkratka (např. FLY)</label>
                    <input
                        type="text"
                        name="shortName"
                        value={formData.shortName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Popis (volitelné)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={isLoading} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                        {isLoading ? 'Vytvářím tým...' : 'Založit tým'}
                    </button>
                </div>
            </form>
        </div>
    );
}