'use client';

import React from 'react';
import { useDashboard } from '@/hooks/Dashboard/useDashboards';
import './Dashboard.css';

export default function DashboardPage() {
    const { user, invitations, error, isLoading, handleAccept, handleDecline } = useDashboard();

    let content = null;
    if (isLoading === true) {
        content = <p>Načítám data...</p>;
    } else {
        if (error !== '') {
            content = <p className="error-message">{error}</p>;
        } else {
            let userName = "Hráči";
            if (user !== null) {
                if (user.firstName !== undefined) {
                    userName = user.firstName;
                }
            }

            content = (
                <div>
                    <h1 className="dashboard-welcome">Vítej, {userName}!</h1>
                    <div className="invitations-section">
                        <h2>Tvé pozvánky</h2>
                        {invitations.map((inv: { teamId: string, teamName: string }) => (
                            <div key={inv.teamId} className="invitation-card">
                                <span>Tým: {inv.teamName}</span>
                                <button onClick={() => { handleAccept(inv.teamId); }}>Přijmout</button>
                                <button onClick={() => { handleDecline(inv.teamId); }}>Odmítnout</button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="dashboard-container">
            {content}
        </div>
    );
}