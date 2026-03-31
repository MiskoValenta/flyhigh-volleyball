'use client';

import React from 'react';
import { useCreateTeam } from '@/hooks/Teams/useCreateTeam';
import './CreateTeam.css';

export default function CreateTeamPage() {
    const { formData, error, isLoading, handleChange, handleSubmit } = useCreateTeam();

    return (
        <div className="CreateTeamContainer">
            <div className="CreateTeamCard">
                <h1 className="CreateTeamTitle">Založit nový tým</h1>

                {error && <div className="ErrorMessage">{error}</div>}

                <form className="CreateTeamForm" onSubmit={handleSubmit}>
                    <div className="FormGroup">
                        <label className="FormLabel">Název týmu</label>
                        <input
                            type="text"
                            name="teamName"
                            className="FormInput"
                            value={formData.teamName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="FormGroup">
                        <label className="FormLabel">Zkratka (např. FLY)</label>
                        <input
                            type="text"
                            name="shortName"
                            className="FormInput"
                            value={formData.shortName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="FormGroup">
                        <label className="FormLabel">Popis (volitelné)</label>
                        <textarea
                            name="description"
                            className="FormTextarea"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>
                    <button type="submit" className="SubmitButton" disabled={isLoading}>
                        {isLoading ? 'Vytvářím tým...' : 'Založit tým'}
                    </button>
                </form>
            </div>
        </div>
    );
}