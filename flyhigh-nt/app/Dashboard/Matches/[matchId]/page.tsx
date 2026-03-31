'use client';

import React from 'react';
import { useMatchDetail } from '@/hooks/Matches/useMatchDetail';
import './MatchDetail.css';

export default function MatchDetailPage({ params }: { params: { matchId: string } }) {
    const { error, isLoading, handleAccept, handleReject } = useMatchDetail(params.matchId);

    let errorMessage = null;
    if (error !== '') {
        errorMessage = <p className="error-message">{error}</p>;
    }

    let actionText = "Načítám...";

    return (
        <div className="match-detail-container">
            <h1 className="match-title">Správa zápasu</h1>

            {errorMessage}

            <div className="match-actions">
                <button
                    onClick={handleAccept}
                    className="accept-button"
                    disabled={isLoading}
                >
                    Přijmout zápas
                </button>

                <button
                    onClick={handleReject}
                    className="reject-button"
                    disabled={isLoading}
                >
                    Odmítnout zápas
                </button>
            </div>
        </div>
    );
}