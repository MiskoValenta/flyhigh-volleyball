'use client';

import React from 'react';
import { useDashboard } from '@/hooks/Dashboard/useDashboards';
import { PendingInvitationDto } from '@/types/team';
import './Dashboard.css';

export default function DashboardPage() {
    const { user, invitations, error, isLoading, handleAccept, handleDecline } = useDashboard();

    if (isLoading) {
        return <div className="DashboardLoading">Načítám data nástěnky...</div>;
    }

    return (
        <div className="DashboardContainer">
            <header className="DashboardHeader">
                <h1 className="DashboardTitle">
                    Vítej zpět, {user?.firstName ? user.firstName : 'Hráči'}! 👋
                </h1>
                <p className="DashboardSubtitle">Zde je tvůj aktuální přehled.</p>
            </header>

            {error && <div className="DashboardError">{error}</div>}

            <section className="InvitationsSection">
                <h2 className="SectionHeading">Nové Pozvánky do Týmu</h2>

                {invitations.length === 0 ? (
                    <p className="EmptyStateText">Momentálně nemáš žádné nové pozvánky.</p>
                ) : (
                    <div className="InvitationsGrid">
                        {invitations.map((invitation: PendingInvitationDto) => (
                            <div key={invitation.teamId} className="InvitationCard">
                                <div className="InvitationInfo">
                                    <h3 className="TeamName">{invitation.teamName}</h3>
                                    <p className="InvitingRole">Pozice: {invitation.invitingRole}</p>
                                </div>
                                <div className="InvitationActions">
                                    <button
                                        className="AcceptButton"
                                        onClick={() => handleAccept(invitation.teamId)}
                                    >
                                        Přijmout
                                    </button>
                                    <button
                                        className="DeclineButton"
                                        onClick={() => handleDecline(invitation.teamId)}
                                    >
                                        Odmítnout
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}