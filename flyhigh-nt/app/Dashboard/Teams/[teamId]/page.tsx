'use client';

import React, { use } from 'react';
import { useTeamDetail } from '@/hooks/Teams/useTeamDetail';
import { TeamMemberDto } from '@/types/team';
import DashboardEvents from '@/components/DashboardEvents/DashboardEvents';
import './TeamDetail.css';

export default function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
    const { teamId } = use(params);
    const { team, isLoading, error, handleRemoveMember } = useTeamDetail(teamId);

    if (isLoading) return <div className="TeamDetailLoading">Načítám detaily týmu...</div>;
    if (error) return <div className="TeamDetailError">{error}</div>;
    if (!team) return <div className="TeamDetailError">Tým nenalezen.</div>;

    return (
        <div className="TeamDetailContainer">
            <header className="TeamHeaderCard">
                <div className="TeamHeaderInfo">
                    <h1 className="TeamHeading">{team.teamName} <span>({team.shortName})</span></h1>
                    <p className="TeamDescription">{team.description || 'Bez popisku'}</p>
                </div>
                <div className="TeamHeaderRole">
                    <span>Tvoje role: </span>
                    <strong>{team.myRole}</strong>
                </div>
            </header>

            <div className="TeamContentGrid">
                <section className="MembersSection">
                    <h2 className="SectionHeading">Členové týmu</h2>
                    <ul className="MembersList">
                        {team.members.map((member: TeamMemberDto) => (
                            <li key={member.userId} className="MemberItem">
                                <div className="MemberInfo">
                                    <span className="MemberName">{member.firstName} {member.lastName}</span>
                                    <span className="MemberRole">{member.role}</span>
                                </div>
                                {team.myRole === 'Owner' && (
                                    <button
                                        className="RemoveMemberBtn"
                                        onClick={() => handleRemoveMember(member.userId)}
                                    >
                                        Odebrat
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="EventsSection">
                    <DashboardEvents teamId={teamId} />
                </section>
            </div>
        </div>
    );
}