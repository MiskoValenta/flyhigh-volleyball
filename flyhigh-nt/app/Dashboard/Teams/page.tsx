"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoChevronForward, IoCheckmark, IoClose } from "react-icons/io5";
import { getMyTeams, getPendingInvitations, acceptInvitation, declineInvitation } from "@/lib/teamApi";
import { TeamResponseDto, PendingInvitationDto, TeamRole, TeamMemberStatus } from "@/types/team";
import "./Teams.css";

export default function TeamsPage() {
    const [activeTeams, setActiveTeams] = useState<TeamResponseDto[]>([]);
    const [pendingTeams, setPendingTeams] = useState<PendingInvitationDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const loadData = async () => {
        setIsLoading(true);
        setError("");
        try {
            const teamsData = await getMyTeams();
            const invitesData = await getPendingInvitations();

            const active = [];
            for (let i = 0; i < teamsData.length; i++) {
                const t = teamsData[i];
                if (t.status === "Active") {
                    active.push(t);
                } else {
                    if (t.status === TeamMemberStatus.Active) {
                        active.push(t);
                    }
                }
            }

            setActiveTeams(active);
            setPendingTeams(invitesData);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError("Chyba při načítání dat.");
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAccept = async (e: React.MouseEvent, teamId: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await acceptInvitation(teamId);
            await loadData();
        } catch (err: any) {
            alert("Chyba při přijímání pozvánky.");
        }
    };

    const handleDecline = async (e: React.MouseEvent, teamId: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await declineInvitation(teamId);
            await loadData();
        } catch (err: any) {
            alert("Chyba při odmítání pozvánky.");
        }
    };

    if (isLoading) {
        return <div className="teams-state-message">Načítám týmy...</div>;
    }

    if (error !== "") {
        return <div className="teams-state-message error">Chyba: {error}</div>;
    }

    let pendingSection = null;
    if (pendingTeams.length > 0) {
        const pendingCards = [];
        for (let i = 0; i < pendingTeams.length; i++) {
            const invite = pendingTeams[i];
            let roleToDisplay = invite.role;
            if (!roleToDisplay) {
                roleToDisplay = TeamRole.Member;
            }

            pendingCards.push(
                <Link
                    key={invite.teamId}
                    href={`/Dashboard/Teams/${invite.teamId}`}
                    className="team-card pending-card glass-card-dark"
                >
                    <div className="team-header">
                        <h3 className="team-name">{invite.teamName}</h3>
                        <span className="pending-badge">Pozvánka</span>
                    </div>
                    <hr className="team-divider" />
                    <div className="team-info-row">
                        <span className="info-label">Nabízená role:</span>
                        <span className={`role-badge role-${roleToDisplay}`}>
                            {roleToDisplay}
                        </span>
                    </div>
                    <div className="pending-actions">
                        <button className="btn-accept" onClick={(e) => handleAccept(e, invite.teamId)}>
                            <IoCheckmark /> Přijmout
                        </button>
                        <button className="btn-decline" onClick={(e) => handleDecline(e, invite.teamId)}>
                            <IoClose /> Odmítnout
                        </button>
                    </div>
                </Link>
            );
        }

        pendingSection = (
            <div className="pending-section">
                <h2 className="dashboard-subheading">Čekající pozvánky</h2>
                <div className="teams-container">
                    {pendingCards}
                </div>
            </div>
        );
    }

    let activeHeaderBtn = null;
    if (activeTeams.length > 0) {
        activeHeaderBtn = (
            <Link href="/Dashboard/CreateTeam" className="button-primary">
                + Nový tým
            </Link>
        );
    }

    let activeCards = [];
    if (activeTeams.length > 0) {
        for (let i = 0; i < activeTeams.length; i++) {
            const team = activeTeams[i];
            let role = team.role;
            if (!role) {
                role = TeamRole.Member;
            }

            let pCount = team.playerCount;
            if (!pCount) {
                pCount = 0;
            }

            activeCards.push(
                <Link
                    key={team.id}
                    href={`/Dashboard/Teams/${team.id}`}
                    className="team-card glass-card-dark"
                >
                    <div className="team-header">
                        <h3 className="team-name">{team.teamName}</h3>
                        <span className="team-abbreviation">
                            {team.shortName}
                        </span>
                    </div>

                    <hr className="team-divider" />

                    <div className="team-info-row">
                        <span className="info-label">Moje role:</span>
                        <span className={`role-badge role-${role}`}>
                            {role}
                        </span>
                    </div>

                    <div className="team-info-row">
                        <span className="info-label">Počet hráčů:</span>
                        <span className="info-value highlight">{pCount}</span>
                    </div>

                    <div className="team-card-footer">
                        <span className="show-more-text">
                            Zobrazit detail <IoChevronForward className="show-more-icon" />
                        </span>
                    </div>
                </Link>
            );
        }
    } else {
        activeCards.push(
            <div key="empty" className="teams-empty-state glass-card-dark">
                <p className="teams-empty-text">Zatím nejste v žádném týmu.</p>
                <Link
                    href="/Dashboard/CreateTeam"
                    className="button-primary"
                >
                    Vytvořit první tým
                </Link>
            </div>
        );
    }

    return (
        <div className="teams-page-wrapper">
            {pendingSection}

            <div className="teams-page-header">
                <h1 className="dashboard-heading">Moje Týmy</h1>
                {activeHeaderBtn}
            </div>

            <div className="teams-container">
                {activeCards}
            </div>
        </div>
    );
}