'use client';

import React, { use, useState, useEffect } from "react";
import { useTeamDetail } from "@/hooks/Teams/useTeamDetail";
import { useTeamStats } from "@/hooks/Teams/useTeamStats";
import DashboardEvents from "@/components/DashboardEvents/DashboardEvents";
import { TeamRole } from "@/types/team";
import { IoPeopleOutline, IoTrophyOutline, IoCalendarOutline, IoCopyOutline } from 'react-icons/io5';
import "./TeamDetail.css";

export default function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
    const { teamId } = use(params);
    const { team, currentUserId, isLoading, error, handleRemoveMember, handleAddMember, handleChangeRole, handleUpdateTeam } = useTeamDetail(teamId);
    const { teamMatchesPlayed, teamEventsCount, isLoadingStats } = useTeamStats(teamId);

    const [isEditingTeam, setIsEditingTeam] = useState(false);
    const [editTeamName, setEditTeamName] = useState("");
    const [editShortName, setEditShortName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const [newMemberId, setNewMemberId] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<TeamRole>(TeamRole.Member);

    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    useEffect(() => {
        if (team !== null) {
            setEditTeamName(team.teamName);
            setEditShortName(team.shortName);
            if (team.description) {
                setEditDescription(team.description);
            } else {
                setEditDescription("");
            }
        }
    }, [team]);

    if (isLoading) {
        return <div className="TeamDetailLoading">Načítám detaily týmu...</div>;
    }

    if (error) {
        return <div className="TeamDetailError">{error}</div>;
    }

    if (!team) {
        return <div className="TeamDetailError">Tým nenalezen.</div>;
    }

    const copyTeamIdToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(teamId);
            setCopySuccess(true);
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        } catch (err) {
            console.error(err);
        }
    };

    let copyButtonText = 'Kopírovat ID';
    let copyButtonClass = 'BtnSecondary';
    if (copySuccess) {
        copyButtonText = 'Zkopírováno!';
        copyButtonClass = 'BtnSecondary success';
    }

    let descriptionDisplay = 'Bez popisku';
    if (team.description) {
        descriptionDisplay = team.description;
    }

    let membersCountDisplay = team.members.length.toString();
    let eventsCountDisplay = teamEventsCount.toString();
    let matchesCountDisplay = teamMatchesPlayed.toString();

    if (isLoadingStats) {
        eventsCountDisplay = '...';
        matchesCountDisplay = '...';
    }

    const submitEditTeam = (e: React.FormEvent) => {
        e.preventDefault();
        handleUpdateTeam({
            teamName: editTeamName,
            abbreviation: editShortName,
            description: editDescription
        });
        setIsEditingTeam(false);
    };

    const submitAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        handleAddMember(newMemberId, newMemberRole);
        setNewMemberId("");
        setNewMemberRole(TeamRole.Member);
    };

    let isManager = false;
    if (team.myRole === TeamRole.Owner) {
        isManager = true;
    } else if (team.myRole === TeamRole.Coach) {
        isManager = true;
    }

    let teamManagementSection = null;
    if (isManager) {
        let editTeamForm = null;
        if (isEditingTeam) {
            editTeamForm = (
                <form className="ManagementForm" onSubmit={submitEditTeam}>
                    <div className="FormGroup">
                        <label>Název týmu</label>
                        <input
                            type="text"
                            value={editTeamName}
                            onChange={(e) => setEditTeamName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="FormGroup">
                        <label>Zkratka týmu</label>
                        <input
                            type="text"
                            value={editShortName}
                            onChange={(e) => setEditShortName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="FormGroup">
                        <label>Popis</label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                    </div>
                    <div className="FormActions">
                        <button type="submit" className="BtnPrimary">Uložit změny</button>
                        <button type="button" className="BtnSecondary" onClick={() => setIsEditingTeam(false)}>Zrušit</button>
                    </div>
                </form>
            );
        } else {
            editTeamForm = (
                <button className="BtnPrimary" onClick={() => setIsEditingTeam(true)}>
                    Upravit informace o týmu
                </button>
            );
        }

        teamManagementSection = (
            <div className="TeamManagementSection">
                <div className="ManagementCard glass-card-dark">
                    <h3 className="SectionHeading">Správa týmu</h3>
                    {editTeamForm}
                </div>
                <div className="ManagementCard glass-card-dark">
                    <h3 className="SectionHeading">Přidat nového člena</h3>
                    <form className="ManagementForm" onSubmit={submitAddMember}>
                        <div className="FormGroup">
                            <label>Uživatelské ID (z Dashboardu uživatele)</label>
                            <input
                                type="text"
                                value={newMemberId}
                                onChange={(e) => setNewMemberId(e.target.value)}
                                placeholder="Zadejte ID..."
                                required
                            />
                        </div>
                        <div className="FormGroup">
                            <label>Role</label>
                            <select
                                value={newMemberRole}
                                onChange={(e) => setNewMemberRole(e.target.value as TeamRole)}
                            >
                                <option value={TeamRole.Coach}>Trenér</option>
                                <option value={TeamRole.Member}>Hráč</option>
                            </select>
                        </div>
                        <div className="FormActions">
                            <button type="submit" className="BtnPrimary">Přidat uživatele</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    let membersList = [];
    for (let i = 0; i < team.members.length; i++) {
        const member = team.members[i];

        let canManageMember = false;
        let canChangeToOwner = false;

        if (member.userId !== currentUserId) {
            if (team.myRole === TeamRole.Owner) {
                canManageMember = true;
                canChangeToOwner = true;
            } else if (team.myRole === TeamRole.Coach) {
                if (member.role !== TeamRole.Owner) {
                    if (member.role !== TeamRole.Coach) {
                        canManageMember = true;
                    }
                }
            }
        }

        let memberActions = null;
        if (canManageMember) {
            let options = [];
            if (canChangeToOwner) {
                options.push(<option key={TeamRole.Owner} value={TeamRole.Owner}>Majitel</option>);
            }
            options.push(<option key={TeamRole.Coach} value={TeamRole.Coach}>Trenér</option>);
            options.push(<option key={TeamRole.Member} value={TeamRole.Member}>Hráč</option>);

            memberActions = (
                <div className="MemberActions">
                    <select
                        className="RoleSelect"
                        value={member.role as string}
                        onChange={(e) => handleChangeRole(member.userId, e.target.value as TeamRole)}
                    >
                        {options}
                    </select>
                    <button
                        className="RemoveMemberBtn"
                        onClick={() => handleRemoveMember(member.userId)}
                    >
                        Odebrat
                    </button>
                </div>
            );
        }

        let translatedRole = member.role;
        if (member.role === TeamRole.Owner) {
            translatedRole = "Majitel";
        } else if (member.role === TeamRole.Coach) {
            translatedRole = "Trenér";
        } else if (member.role === TeamRole.Member) {
            translatedRole = "Hráč";
        }

        membersList.push(
            <li key={member.userId} className="MemberItem">
                <div className="MemberInfo">
                    <span className="MemberName">{member.firstName} {member.lastName}</span>
                    <span className="MemberRole">{translatedRole}</span>
                </div>
                {memberActions}
            </li>
        );
    }

    return (
        <div className="TeamDetailContainer">
            <header className="TeamHeaderCard">
                <div className="TeamHeaderInfo">
                    <h1 className="TeamHeading">{team.teamName} <span>({team.shortName})</span></h1>
                    <p className="TeamDescription">{descriptionDisplay}</p>

                    <div className="TeamIdContainer">
                        <span className="TeamIdLabel">ID Týmu pro pozvání hráčem:</span>
                        <code className="TeamIdCode hide-on-mobile">{teamId}</code>
                        <button className={copyButtonClass} onClick={copyTeamIdToClipboard}>
                            <IoCopyOutline style={{ marginRight: '0.5rem' }} />
                            {copyButtonText}
                        </button>
                    </div>
                </div>
                <div className="TeamHeaderRole">
                    <span>Tvoje role: </span>
                    <strong>{team.myRole}</strong>
                </div>
            </header>

            <div className="TeamStatsGrid">
                <div className="TeamStatBox glass-card-dark">
                    <IoPeopleOutline className="TeamStatIcon" />
                    <div className="TeamStatContent">
                        <span className="TeamStatValue">{membersCountDisplay}</span>
                        <span className="TeamStatLabel">Počet členů</span>
                    </div>
                </div>
                <div className="TeamStatBox glass-card-dark">
                    <IoCalendarOutline className="TeamStatIcon" />
                    <div className="TeamStatContent">
                        <span className="TeamStatValue">{eventsCountDisplay}</span>
                        <span className="TeamStatLabel">Počet událostí</span>
                    </div>
                </div>
                <div className="TeamStatBox glass-card-dark">
                    <IoTrophyOutline className="TeamStatIcon" />
                    <div className="TeamStatContent">
                        <span className="TeamStatValue">{matchesCountDisplay}</span>
                        <span className="TeamStatLabel">Odehrané zápasy</span>
                    </div>
                </div>
            </div>

            <div className="TeamContentGrid">
                <section className="MembersSection">
                    <h2 className="SectionHeading">Členové týmu</h2>
                    <ul className="MembersList">
                        {membersList}
                    </ul>
                    {teamManagementSection}
                </section>

                <section className="EventsSection">
                    <DashboardEvents teamId={teamId} />
                </section>
            </div>
        </div>
    );
}