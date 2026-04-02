'use client';

import React, { use, useState, useEffect } from "react";
import { useTeamDetail } from "@/hooks/Teams/useTeamDetail";
import { useTeamStats } from "@/hooks/Teams/useTeamStats";
import DashboardEvents from "@/components/DashboardEvents/DashboardEvents";
import { IoPeopleOutline, IoTrophyOutline, IoCalendarOutline } from 'react-icons/io5';
import "./TeamDetail.css";

export default function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
    const { teamId } = use(params);
    const { team, isLoading, error, handleRemoveMember, handleAddMember, handleChangeRole, handleUpdateTeam } = useTeamDetail(teamId);
    const { teamMatchesPlayed, teamEventsCount, isLoadingStats } = useTeamStats(teamId);

    const [isEditingTeam, setIsEditingTeam] = useState(false);
    const [editTeamName, setEditTeamName] = useState("");
    const [editShortName, setEditShortName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const [newMemberId, setNewMemberId] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("Player");

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
    };

    let isManager = false;
    if (team.myRole === 'Owner') {
        isManager = true;
    } else if (team.myRole === 'Coach') {
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
                                onChange={(e) => setNewMemberRole(e.target.value)}
                            >
                                <option value="Coach">Trenér (Coach)</option>
                                <option value="Player">Hráč (Player)</option>
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

        if (team.myRole === 'Owner') {
            canManageMember = true;
            canChangeToOwner = true;
        } else if (team.myRole === 'Coach') {
            if (member.role !== 'Owner') {
                if (member.role !== 'Coach') {
                    canManageMember = true;
                }
            }
        }

        let memberActions = null;
        if (canManageMember) {
            let options = [];
            if (canChangeToOwner) {
                options.push(<option key="Owner" value="Owner">Majitel</option>);
            }
            options.push(<option key="Coach" value="Coach">Trenér</option>);
            options.push(<option key="Player" value="Player">Hráč</option>);

            memberActions = (
                <div className="MemberActions">
                    <select
                        className="RoleSelect"
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.userId, e.target.value)}
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

        membersList.push(
            <li key={member.userId} className="MemberItem">
                <div className="MemberInfo">
                    <span className="MemberName">{member.firstName} {member.lastName}</span>
                    <span className="MemberRole">{member.role}</span>
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