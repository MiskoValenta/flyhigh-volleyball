"use client";

import React from 'react';
import Link from 'next/link';
import { useTeamList } from '@/hooks/Teams/useTeamList';
import { useMatchesList } from '@/hooks/Matches/useMatchesList';
import { useMatchDetail } from '@/hooks/Matches/useMatchDetail';
import { MatchStatus } from '@/types/match';
import './Matches.css';

export default function MatchesPage() {
    const { teams, isLoading: teamsLoading } = useTeamList();

    if (teamsLoading) return <div className="loading-ml">Načítání týmů...</div>;

    return (
        <div className="container-ml">
            <h1 className="title-ml">Správa zápasů</h1>
            {teams.length === 0 ? (
                <p className="no-data-ml">Nejste členem žádného týmu.</p>
            ) : (
                teams.map(team => (
                    <TeamMatchesSection key={team.id} teamId={team.id} teamName={team.teamName} />
                ))
            )}
        </div>
    );
}

function TeamMatchesSection({ teamId, teamName }: { teamId: string, teamName: string }) {
    const { matches, loading, refetch } = useMatchesList(teamId);

    if (loading) return null;

    const pending = matches.filter(m => m.status === MatchStatus.Pending);
    const scheduled = matches.filter(m => m.status === MatchStatus.Accepted || m.status === MatchStatus.InProgress);
    const finished = matches.filter(m => m.status === MatchStatus.Finished);

    return (
        <div className="team-section-ml">
            <h2 className="team-title-ml">Tým: {teamName}</h2>

            {pending.length > 0 && (
                <div className="group-ml">
                    <h3 className="group-title-ml">Nové pozvánky</h3>
                    <div className="grid-ml">
                        {pending.map(match => (
                            <MatchCard key={match.id} match={match} isPending={true} currentTeamId={teamId} onAction={refetch} />
                        ))}
                    </div>
                </div>
            )}

            <div className="group-ml">
                <h3 className="group-title-ml">Aktivní zápasy</h3>
                {scheduled.length > 0 ? (
                    <div className="grid-ml">
                        {scheduled.map(match => (
                            <MatchCard key={match.id} match={match} isPending={false} currentTeamId={teamId} onAction={refetch} />
                        ))}
                    </div>
                ) : <p className="empty-ml">Žádné aktivní zápasy.</p>}
            </div>

            {finished.length > 0 && (
                <div className="group-ml">
                    <h3 className="group-title-ml">Historie</h3>
                    <div className="grid-ml">
                        {finished.map(match => (
                            <MatchCard key={match.id} match={match} isPending={false} currentTeamId={teamId} onAction={refetch} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function MatchCard({ match, isPending, currentTeamId, onAction }: { match: any, isPending: boolean, currentTeamId: string, onAction: () => void }) {
    const { acceptMatch, rejectMatch, actionLoading } = useMatchDetail(match.id);

    const handleAccept = async (e: React.MouseEvent) => {
        e.preventDefault();
        await acceptMatch();
        onAction();
    };

    const handleReject = async (e: React.MouseEvent) => {
        e.preventDefault();
        await rejectMatch();
        onAction();
    };

    const date = new Date(match.scheduledDate).toLocaleDateString('cs-CZ');
    const time = new Date(match.scheduledDate).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

    return (
        <Link href={`/Dashboard/Matches/${match.id}`} className="card-ml">
            <div className="card-header-ml">
                <span className="teams-ml">OA vs SSKSG</span>
                <span className={`status-ml status-${match.status.toLowerCase()}-ml`}>{match.status}</span>
            </div>
            <div className="card-info-ml">
                <p><strong>Kdy:</strong> {date} v {time}</p>
                <p><strong>Kde:</strong> {match.location}</p>
            </div>

            {isPending && match.awayTeamId === currentTeamId && (
                <div className="card-actions-ml">
                    <button onClick={handleAccept} disabled={actionLoading} className="btn-accept-ml">Přijmout</button>
                    <button onClick={handleReject} disabled={actionLoading} className="btn-reject-ml">Odmítnout</button>
                </div>
            )}

            <div className="card-footer-ml">
                <span className="animated-link-ml">Zobrazit detaily zápasu</span>
            </div>
        </Link>
    );
}