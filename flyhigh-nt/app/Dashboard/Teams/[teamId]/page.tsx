'use client';

import React from 'react';
import { useTeamDetail } from '@/hooks/Teams/useTeamDetail';
import './TeamDetail.css';

export default function TeamDetailPage({ params }: { params: { teamId: string } }) {
    const { error, isLoading, handleDeleteTeam, handleRemoveMember } = useTeamDetail(params.teamId);

    let errorMessage = null;
    if (error !== '') {
        errorMessage = <p className="error-message">{error}</p>;
    }

    let deleteButtonText = "Smazat tým";
    if (isLoading === true) {
        deleteButtonText = "Zpracovávám...";
    }

    return (
        <div className="team-detail-container">
            <h1 className="team-title">Detail týmu</h1>

            {errorMessage}

            <div className="team-actions">
                <button
                    onClick={handleDeleteTeam}
                    className="delete-team-button"
                    disabled={isLoading}
                >
                    {deleteButtonText}
                </button>

                <button
                    onClick={() => { handleRemoveMember('id-clena-zde'); }}
                    className="remove-member-button"
                    disabled={isLoading}
                >
                    Odebrat testovacího člena
                </button>
            </div>
        </div>
    );
}