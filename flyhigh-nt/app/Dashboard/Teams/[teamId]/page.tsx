"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    IoArrowBack,
    IoCopyOutline,
    IoCheckmark,
    IoTrashOutline,
    IoPersonAddOutline,
    IoShieldCheckmarkOutline
} from "react-icons/io5";
import { useTeamDetail } from "../../../../hooks/Teams/useTeamDetail";
import { TeamRole } from "../../../../types/team";
import "./TeamDetail.css";

export default function TeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.teamId as string;
    const { team, isLoading, error, handleAddMember } = useTeamDetail(teamId);
    const [memberInput, setMemberInput] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [copied, setCopied] = useState(false);

    if (isLoading)
        return <div className="detail-state-message">Načítám detail týmu...</div>;

    if (error || !team)
        return <div className="detail-state-message error">Chyba: {error || "Tým nebyl nalezen"}</div>;

    const isOwner = team.myRole === TeamRole.Owner;
    const isManager = team.myRole === TeamRole.Owner || team.myRole === TeamRole.Coach;

    const handleCopyId = () => {
        navigator.clipboard.writeText(team.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDeleteTeam = () => {
        alert("Funkce mazání týmu bude implementována v dalším kroku!");
    };

    const onSubmitAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberInput) return;
        setIsAdding(true);
        try {
            await handleAddMember(memberInput, TeamRole.Member);

            setMemberInput("");
            alert("Uživatel byl úspěšně přidán do týmu.");
        } catch (err: any) {
            alert(err.message || "Nepodařilo se přidat člena. Zkontrolujte ID.");
        } finally {
            setIsAdding(false);
        }
    };

    const activePlayersCount = team.members ? team.members.filter(m => m.isActive).length : 0;
    const pendingPlayersCount = team.members ? team.members.filter(m => !m.isActive).length : 0;

    return (
        <div className="detail-page-wrapper">
            <div className="detail-top-bar">
                <Link href="/Dashboard/Teams" className="btn-back">
                    <IoArrowBack size={20} />
                    <span>Zpět na týmy</span>
                </Link>

                {isOwner && (
                    <button onClick={handleDeleteTeam} className="btn-delete">
                        <IoTrashOutline size={18} />
                        <span>Smazat tým</span>
                    </button>
                )}
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
                        {team.description || "Tento tým zatím nemá žádný popis."}
                    </p>

                    <div className="detail-id-box">
                        <span className="id-label">ID Týmu:</span>
                        <span className="id-hash">{team.id}</span>
                        <button onClick={handleCopyId} className="btn-copy" title="Kopírovat ID">
                            {copied ? <IoCheckmark style={{ color: '#4ade80' }} /> : <IoCopyOutline />}
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
                        <span className="stat-value">0</span>
                        <span className="stat-label">Událostí</span>
                    </div>
                </div>
            </div>

            {isManager && (
                <div className="management-section glass-card-dark">
                    <h2 className="section-title">
                        <IoShieldCheckmarkOutline /> Správa týmu
                    </h2>
                    <hr className="section-divider" />

                    <form onSubmit={onSubmitAddMember} className="add-member-form">
                        <div className="input-wrapper">
                            <label>Přidat člena (ID Uživatele)</label>
                            <div className="input-group">
                                <IoPersonAddOutline className="input-icon" />
                                <input
                                    type="text"
                                    value={memberInput}
                                    onChange={(e) => setMemberInput(e.target.value)}
                                    placeholder="Zadejte ID uživatele..."
                                    required
                                    className="input-glass"
                                />
                                <button type="submit" disabled={isAdding} className="button-primary">
                                    {isAdding ? "Pracuji..." : "Přidat člena"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="members-section">
                <h2 className="section-title">Členové týmu</h2>
                <div className="members-grid">
                    {team.members && team.members.length > 0 ? (
                        team.members.map((member) => {
                            const mRole = member.role || TeamRole.Member;

                            return (
                                <div key={member.userId} className="member-card glass-card-dark">
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
                                            {!member.isActive && (
                                                <span className="status-badge pending">Nepotvrzeno</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-members-text">V tomto týmu zatím nejsou žádní další členové.</div>
                    )}
                </div>
            </div>

        </div>
    );
}