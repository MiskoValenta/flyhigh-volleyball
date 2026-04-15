"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    IoArrowBack,
    IoCopyOutline,
    IoCheckmark,
    IoTrashOutline,
    IoPersonAddOutline,
    IoShieldCheckmarkOutline,
    IoCalendarOutline,
    IoTrophyOutline,
    IoClose
} from "react-icons/io5";
import { useTeamDetail } from "@/hooks/Teams/useTeamDetail";
import { useDeleteTeam } from "@/hooks/Teams/useDeleteTeam";
import { TeamRole } from "@/types/team";
import { useTeamEvents } from "@/hooks/Events/useTeamEvents";
import DashboardEvents from "@/components/DashboardEvents/DashboardEvents";
import { DashboardEventItem } from "@/types/event";
import { acceptInvitation, declineInvitation } from "@/lib/teamApi";
import "./TeamDetail.css";

export default function TeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.teamId as string;

    const {
        team,
        currentUserId,
        isLoading: isTeamLoading,
        error: teamError,
        handleAddMember,
        handleRemoveMember,
        handleChangeRole
    } = useTeamDetail(teamId);

    const { events: teamEvents, isLoading: isEventsLoading } = useTeamEvents(teamId);
    const { removeTeam, isDeleting } = useDeleteTeam();

    const [memberInput, setMemberInput] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [copied, setCopied] = useState(false);

    const upcomingSortedEvents = useMemo(() => {
        if (!teamEvents) {
            return [];
        }
        if (!team) {
            return [];
        }
        const now = new Date();

        const validEvents = [];
        for (let i = 0; i < teamEvents.length; i++) {
            const e = teamEvents[i];
            if (e.eventDate) {
                if (new Date(e.eventDate) > now) {
                    validEvents.push(e);
                }
            }
        }

        validEvents.sort((a, b) => {
            const dateA = new Date(a.eventDate as string).getTime();
            const dateB = new Date(b.eventDate as string).getTime();
            return dateA - dateB;
        });

        const mappedEvents = [];
        for (let i = 0; i < validEvents.length; i++) {
            const e = validEvents[i];
            mappedEvents.push({
                ...e,
                teamName: team.teamName
            } as DashboardEventItem);
        }

        return mappedEvents;
    }, [teamEvents, team]);

    if (isTeamLoading) {
        return <div className="detail-state-message">Načítám detail týmu...</div>;
    }

    if (teamError) {
        return <div className="detail-state-message error">Chyba: {teamError}</div>;
    }

    if (!team) {
        return <div className="detail-state-message error">Chyba: Tým nebyl nalezen</div>;
    }

    let isPending = false;
    if (team.members) {
        for (let i = 0; i < team.members.length; i++) {
            if (team.members[i].userId === currentUserId) {
                if (team.members[i].isActive === false) {
                    isPending = true;
                }
            }
        }
    }

    let isOwner = false;
    if (team.myRole === TeamRole.Owner) {
        isOwner = true;
    }

    let isManager = false;
    if (team.myRole === TeamRole.Owner) {
        isManager = true;
    } else {
        if (team.myRole === TeamRole.Coach) {
            isManager = true;
        }
    }

    const handleCopyId = () => {
        navigator.clipboard.writeText(team.id);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handleDeleteTeam = async () => {
        if (window.confirm("Opravdu chcete tento tým trvale smazat? Tuto akci nelze vrátit.")) {
            const success = await removeTeam(team.id);
            if (success) {
                alert("Tým byl úspěšně smazán.");
                router.push("/Dashboard/Teams");
            } else {
                alert("Nepodařilo se smazat tým.");
            }
        }
    };

    const onSubmitAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberInput) {
            return;
        }
        setIsAdding(true);
        try {
            await handleAddMember(memberInput, TeamRole.Member);
            setMemberInput("");
            alert("Uživatel byl úspěšně pozván do týmu.");
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert("Nepodařilo se přidat člena. Zkontrolujte ID.");
            }
        }
        setIsAdding(false);
    };

    const onRemoveMember = async (userId: string) => {
        if (window.confirm("Opravdu chcete tohoto hráče odebrat z týmu?")) {
            try {
                await handleRemoveMember(userId);
            } catch (err: any) {
                alert("Chyba při odebírání člena.");
            }
        }
    };

    const onRoleChange = async (userId: string, newRole: TeamRole) => {
        try {
            await handleChangeRole(userId, newRole);
        } catch (err: any) {
            alert("Chyba při změně role.");
        }
    };

    const handleAcceptInvite = async () => {
        try {
            await acceptInvitation(team.id);
            window.location.reload();
        } catch (err: any) {
            alert("Chyba při přijímání pozvánky.");
        }
    };

    const handleDeclineInvite = async () => {
        try {
            await declineInvitation(team.id);
            router.push("/Dashboard/Teams");
        } catch (err: any) {
            alert("Chyba při odmítání pozvánky.");
        }
    };

    let activePlayersCount = 0;
    let pendingPlayersCount = 0;
    if (team.members) {
        for (let i = 0; i < team.members.length; i++) {
            if (team.members[i].isActive) {
                activePlayersCount++;
            } else {
                pendingPlayersCount++;
            }
        }
    }

    let managementButtons = null;
    if (isManager && !isPending) {
        managementButtons = (
            <>
                <Link href={`/Dashboard/Events/Create?teamId=${teamId}`} className="btn-action">
                    <IoCalendarOutline size={18} />
                    <span>Nová událost</span>
                </Link>
                <Link href={`/Dashboard/Matches/Create?teamId=${teamId}`} className="btn-action">
                    <IoTrophyOutline size={18} />
                    <span>Nový zápas</span>
                </Link>
            </>
        );
    }

    let ownerDeleteBtn = null;
    if (isOwner && !isPending) {
        let deleteBtnText = "Smazat tým";
        if (isDeleting) {
            deleteBtnText = "Mažu...";
        }

        ownerDeleteBtn = (
            <button onClick={handleDeleteTeam} className="btn-delete" disabled={isDeleting}>
                <IoTrashOutline size={18} />
                <span>{deleteBtnText}</span>
            </button>
        );
    }

    let descText = team.description;
    if (!descText) {
        descText = "Tento tým zatím nemá žádný popis.";
    }

    let copyIcon = <IoCopyOutline />;
    if (copied) {
        copyIcon = <IoCheckmark className="icon-success" />;
    }

    let eventsSection = null;
    if (!isPending) {
        let eventsContent = null;
        if (isEventsLoading) {
            eventsContent = <div className="no-members-text">Načítám události...</div>;
        } else {
            eventsContent = <DashboardEvents events={upcomingSortedEvents} />;
        }

        eventsSection = (
            <div className="events-section">
                <h2 className="section-title">
                    <IoCalendarOutline />
                    Události týmu
                </h2>
                {eventsContent}
            </div>
        );
    }

    let managementSection = null;
    if (isManager && !isPending) {
        let addBtnText = "Odeslat pozvánku";
        if (isAdding) {
            addBtnText = "Pracuji...";
        }

        managementSection = (
            <div className="management-section glass-card-dark">
                <h2 className="section-title">
                    <IoShieldCheckmarkOutline className="icon-color"/> Přidat nového člena
                </h2>
                <hr className="section-divider" />

                <form onSubmit={onSubmitAddMember} className="add-member-form">
                    <div className="input-wrapper">
                        <label>ID Uživatele</label>
                        <div className="input-group">
                            <IoPersonAddOutline className="input-icon icon-color" />
                            <input
                                type="text"
                                value={memberInput}
                                onChange={(e) => setMemberInput(e.target.value)}
                                placeholder="Zadejte unikátní ID uživatele..."
                                required
                                className="input-glass"
                            />
                            <button type="submit" disabled={isAdding} className="button-primary">
                                {addBtnText}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    let pendingBanner = null;
    if (isPending) {
        pendingBanner = (
            <div className="pending-banner glass-card-dark">
                <div className="pending-banner-content">
                    <h3>Čekající pozvánka</h3>
                    <p>Pro plný přístup a zobrazení událostí přijměte pozvánku.</p>
                </div>
                <div className="pending-actions">
                    <button className="btn-accept" onClick={handleAcceptInvite}>
                        <IoCheckmark /> Přijmout
                    </button>
                    <button className="btn-decline" onClick={handleDeclineInvite}>
                        <IoClose /> Odmítnout
                    </button>
                </div>
            </div>
        );
    }

    let membersContent = [];
    if (team.members && team.members.length > 0) {
        for (let i = 0; i < team.members.length; i++) {
            const member = team.members[i];
            let mRole = member.role;
            if (!mRole) {
                mRole = TeamRole.Member;
            }

            let canEdit = false;
            if (isManager) {
                if (member.userId !== currentUserId) {
                    if (mRole === TeamRole.Owner) {
                        if (isOwner) {
                            canEdit = true;
                        }
                    } else {
                        canEdit = true;
                    }
                }
            }

            let statusBadge = null;
            if (member.isActive === false) {
                statusBadge = <span className="status-badge pending">Nepotvrzeno</span>;
            }

            let ownerOption = null;
            if (isOwner) {
                ownerOption = <option value={TeamRole.Owner}>Owner</option>;
            }

            let actionsDiv = null;
            if (canEdit && !isPending) {
                actionsDiv = (
                    <div className="member-actions">
                        <select
                            className="role-select-glass"
                            value={mRole}
                            onChange={(e) => onRoleChange(member.userId, e.target.value as TeamRole)}
                        >
                            <option value={TeamRole.Member}>Member</option>
                            <option value={TeamRole.Coach}>Coach</option>
                            {ownerOption}
                        </select>

                        <button
                            className="btn-icon-danger"
                            onClick={() => onRemoveMember(member.userId)}
                            title="Odebrat hráče z týmu"
                        >
                            <IoTrashOutline size={18} />
                        </button>
                    </div>
                );
            }

            membersContent.push(
                <div key={member.userId} className="member-card glass-card-dark">
                    <div className="member-card-main">
                        <div className="member-avatar">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div className="member-info">
                            <h4 className="member-name">{member.firstName} {member.lastName}</h4>
                            <span className="member-email">{member.email}</span>
                            <div className="member-tags">
                                <span className={`role-badge role-${mRole}`}>
                                    {mRole}
                                </span>
                                {statusBadge}
                            </div>
                        </div>
                    </div>

                    {actionsDiv}
                </div>
            );
        }
    } else {
        membersContent.push(
            <div key="no-members" className="no-members-text">V tomto týmu zatím nejsou žádní další členové.</div>
        );
    }

    let eventsCountDisplay = "...";
    if (!isEventsLoading) {
        eventsCountDisplay = upcomingSortedEvents.length.toString();
    }

    return (
        <div className="detail-page-wrapper">
            <div className="detail-top-bar">
                <Link href="/Dashboard/Teams" className="btn-back">
                    <IoArrowBack size={20} />
                    <span>Zpět na týmy</span>
                </Link>

                <div className="top-bar-actions">
                    {managementButtons}
                    {ownerDeleteBtn}
                </div>
            </div>

            <div className="detail-header-card glass-card-dark">
                <div className="header-card-content">
                    <div className="header-titles">
                        <h1 className="detail-title">{team.teamName}</h1>
                        <span className="detail-abbr">{team.shortName}</span>
                        <span className={`role-badge role-${team.myRole}`}>
                            {team.myRole}
                        </span>
                    </div>

                    <p className="detail-desc">
                        {descText}
                    </p>

                    <div className="detail-id-box">
                        <span className="id-label">ID Týmu:</span>
                        <span className="id-hash">{team.id}</span>
                        <button onClick={handleCopyId} className="btn-copy" title="Kopírovat ID">
                            {copyIcon}
                        </button>
                    </div>
                </div>

                <div className="detail-stats-row">
                    <div className="stat-box">
                        <span className="stat-value">{activePlayersCount}</span>
                        <span className="stat-label">Aktivní hráči</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">{pendingPlayersCount}</span>
                        <span className="stat-label">Čekající pozvánky</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">
                            {eventsCountDisplay}
                        </span>
                        <span className="stat-label">Nadcházející události</span>
                    </div>
                </div>
            </div>

            {pendingBanner}

            {eventsSection}

            {managementSection}

            <div className="members-section">
                <h2 className="section-title">Soupiska týmu</h2>
                <div className="members-grid">
                    {membersContent}
                </div>
            </div>

        </div>
    );
}