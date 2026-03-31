'use client';

import React from 'react';
import { useLiveMatch } from '@/hooks/Matches/useLiveMatch';
import './Live.css';

export default function LiveMatchPage({ params }: { params: { matchId: string } }) {
    const { error, isLoading, handleStartMatch, handleStartSet, handleAddPoint } = useLiveMatch(params.matchId);

    let errorMessage = null;
    if (error !== '') {
        errorMessage = <p className="error-message">{error}</p>;
    }

    return (
        <div className="live-match-container">
            <h1 className="live-title">Živý zápas</h1>

            {errorMessage}

            <div className="controls-grid">
                <button
                    onClick={handleStartMatch}
                    className="control-button start-match"
                    disabled={isLoading}
                >
                    Zahájit zápas
                </button>

                <button
                    onClick={handleStartSet}
                    className="control-button start-set"
                    disabled={isLoading}
                >
                    Odstartovat aktuální set
                </button>
            </div>

            <div className="score-controls">
                <button
                    onClick={() => { handleAddPoint('Home'); }}
                    className="point-button home-point"
                    disabled={isLoading}
                >
                    +1 Bod (Domácí)
                </button>

                <button
                    onClick={() => { handleAddPoint('Away'); }}
                    className="point-button away-point"
                    disabled={isLoading}
                >
                    +1 Bod (Hosté)
                </button>
            </div>
        </div>
    );
}