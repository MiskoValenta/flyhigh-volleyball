'use client';

import React from 'react';
import { useCreateMatch } from '@/hooks/Matches/useCreateMatch';
import './CreateMatch.css';

export default function CreateMatchPage() {
    const { formData, error, isLoading, handleChange, handleSubmit } = useCreateMatch();

    let errorMessage = null;
    if (error !== '') {
        errorMessage = <p className="error-message">{error}</p>;
    }

    let buttonText = "Naplánovat zápas";
    if (isLoading === true) {
        buttonText = "Vytvářím...";
    }

    return (
        <div className="create-match-container">
            <h1 className="create-match-title">Vytvořit nový zápas</h1>

            <form onSubmit={handleSubmit} className="create-match-form">
                <input
                    type="text"
                    name="homeTeamId"
                    value={formData.homeTeamId}
                    onChange={handleChange}
                    placeholder="ID domácího týmu"
                    className="form-input"
                    required
                />
                <input
                    type="text"
                    name="awayTeamId"
                    value={formData.awayTeamId}
                    onChange={handleChange}
                    placeholder="ID hostujícího týmu"
                    className="form-input"
                    required
                />
                <input
                    type="datetime-local"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Místo konání"
                    className="form-input"
                    required
                />
                <input
                    type="text"
                    name="refereeId"
                    value={formData.refereeId}
                    onChange={handleChange}
                    placeholder="ID rozhodčího (volitelné)"
                    className="form-input"
                />

                {errorMessage}

                <button type="submit" className="submit-button" disabled={isLoading}>
                    {buttonText}
                </button>
            </form>
        </div>
    );
}