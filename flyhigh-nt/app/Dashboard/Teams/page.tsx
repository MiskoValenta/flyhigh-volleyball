"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    IoPeopleOutline,
    IoAddCircleOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoChevronForwardOutline,
    IoShieldCheckmarkOutline
} from "react-icons/io5";
import { useTeamList } from "@/hooks/Teams/useTeamList";
import { TeamMemberStatus } from "@/types/team";
import { acceptInvitation, declineInvitation } from "@/lib/teamApi";
import "./Teams.css";

export default function TeamsPage() {
    const { teams, isLoading, error } = useTeamList();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    if (isLoading) return <div className="teams-state-message">Načítám seznam týmů...</div>;
    if (error) return <div className="teams-state-message error">{error}</div>;

    const pendingTeams = teams.filter(t => t.status === TeamMemberStatus.Pending);
    const activeTeams = teams.filter(t => t.status === TeamMemberStatus.Active || !t.status); 
    const handleRespond = async (teamId: string, accept: boolean) => {
        setActionLoading(teamId);
        try {
            if (accept) {
                await acceptInvitation(teamId);
            } else {
                await declineInvitation(teamId);
            }
            window.location.reload();
        } catch (err: any) {
            alert(err.message || "Nepodařilo se odpovědět na pozvánku.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="teams-page-wrapper">
            <div className="teams-top-bar">
                <h1 className="teams-main-title">Moje týmy</h1>
                <Link href="/Dashboard/CreateTeam" className="btn-create-team button-primary">
                    <IoAddCircleOutline size={20} />
                    Vytvořit nový tým
                </Link>
            </div>

            {pendingTeams.length > 0 && (
                <div className="teams-section">
                    <h2 className="teams-section-title pending">
                        <IoShieldCheckmarkOutline /> Čekající pozvánky
                    </h2>
                    <div className="teams-grid">
                        {pendingTeams.map(team => (
                            <div key={team.id} className="team-card pending-card glass-card-dark">
                                <div className="team-card-header">
                                    <div className="team-abbr">{team.shortName}</div>
                                    <span className="role-badge role-Pending">Pozvánka</span>
                                </div>

                                <div className="team-card-body">
                                    <h3 className="team-name">{team.teamName}</h3>
                                    <div className="team-members-count">
                                        <IoPeopleOutline />
                                        <span>{team.playerCount || team.playerCount || "?"} Členů</span>
                                    </div>
                                </div>

                                <div className="invite-actions-row">
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleRespond(team.id, true); }}
                                        className="btn-invite accept"
                                        disabled={actionLoading === team.id}
                                    >
                                        <IoCheckmarkCircleOutline size={18} /> Přijmout
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleRespond(team.id, false); }}
                                        className="btn-invite decline"
                                        disabled={actionLoading === team.id}
                                    >
                                        <IoCloseCircleOutline size={18} /> Odmítnout
                                    </button>
                                </div>

                                <Link href={`/Dashboard/Teams/${team.id}`} className="btn-view-details">
                                    Zobrazit detaily <IoChevronForwardOutline />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="teams-section">
                <h2 className="teams-section-title">
                    <IoPeopleOutline /> Aktivní týmy
                </h2>
                {activeTeams.length === 0 ? (
                    <div className="teams-empty-state glass-card-dark">
                        <p>Zatím nejste členem žádného aktivního týmu.</p>
                    </div>
                ) : (
                    <div className="teams-grid">
                        {activeTeams.map(team => (
                            <div key={team.id} className="team-card glass-card-dark">
                                <div className="team-card-header">
                                    <div className="team-abbr">{team.shortName}</div>
                                    <span className={`role-badge role-${team.role}`}>{team.role}</span>
                                </div>

                                <div className="team-card-body">
                                    <h3 className="team-name">{team.teamName}</h3>
                                    <div className="team-members-count">
                                        <IoPeopleOutline />
                                        <span>{team.playerCount || team.playerCount || "?"} Členů</span>
                                    </div>
                                </div>

                                <Link href={`/Dashboard/Teams/${team.id}`} className="btn-view-details">
                                    Vstoupit do týmu <IoChevronForwardOutline />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}