"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { getMyTeams } from "@/lib/teamApi";
import { getTeamEvents } from "@/lib/eventApi";
import { getCurrentUser } from "@/lib/api";
import { UserProfile } from "@/types/user";
import { TeamEvent } from "@/types/event";
import DashboardEvents from "@/components/DashboardEvents/DashboardEvents";
import {
    IoCopyOutline,
    IoPeopleOutline,
    IoTrophyOutline,
    IoCalendarOutline,
    IoAddCircleOutline
} from 'react-icons/io5';
import './Dashboard.css';

export default function DashboardPage() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [teamsCount, setTeamsCount] = useState<number>(0);
    const [playedMatchesCount, setPlayedMatchesCount] = useState<number>(0);
    const [upcomingEventsCount, setUpcomingEventsCount] = useState<number>(0);
    const [userTeamIds, setUserTeamIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                const myTeams = await getMyTeams();
                setTeamsCount(myTeams.length);

                const teamIds = myTeams.map(team => team.id);
                setUserTeamIds(teamIds);

                if (teamIds.length > 0) {
                    const allEventsPromises = teamIds.map(id => getTeamEvents(id));
                    const allEventsArrays = await Promise.allSettled(allEventsPromises);

                    const combinedEvents = allEventsArrays
                        .filter((res): res is PromiseFulfilledResult<TeamEvent[]> => res.status === 'fulfilled')
                        .flatMap(res => res.value);

                    const now = new Date();
                    const upcomingEvents = combinedEvents.filter(evt =>
                        evt.eventDate && new Date(evt.eventDate) > now
                    );
                    setUpcomingEventsCount(upcomingEvents.length);

                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                    const token = localStorage.getItem('token');

                    const allMatchesPromises = teamIds.map(async (id) => {
                        const res = await fetch(`${baseUrl}/Matches/team/${id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (!res.ok) return [];
                        return res.json();
                    });

                    const allMatchesArrays = await Promise.allSettled(allMatchesPromises);

                    let totalPlayedMatches = 0;
                    allMatchesArrays.forEach(res => {
                        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                            // Filtrování pouze na ty, které už jsou "Completed"
                            const completed = res.value.filter((m: any) => m.status === 'Completed');
                            totalPlayedMatches += completed.length;
                        }
                    });
                    setPlayedMatchesCount(totalPlayedMatches);
                }
            } catch (error) {
                console.error('Chyba při načítání dat pro dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const copyToClipboard = async () => {
        if (!currentUser?.id) return;

        try {
            await navigator.clipboard.writeText(currentUser.id);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Nepodařilo se kopírovat:', err);
            alert('Chyba při kopírování. Označte ID ručně.');
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Přehled</h1>
            <p className="dashboard-subtext">
                {isLoading
                    ? "Načítám profil a data..."
                    : `Vítejte, ${currentUser?.firstName} ${currentUser?.lastName}! Zde je váš rychlý přehled.`}
            </p>

            {currentUser?.id && (
                <div className="user-id-card glass-card">
                    <div className="user-id-text-container">
                        <h3 className="user-id-heading">Vaše uživatelské ID</h3>
                        <p className="user-id-subtext">Předejte toto ID svému trenérovi, aby vás mohl přidat do týmu na soupisku.</p>
                    </div>
                    <div className="user-id-actions">
                        <code className="user-id-code">
                            {currentUser.id}
                        </code>
                        <button className={`btn-copy ${copySuccess ? 'success' : ''}`} onClick={copyToClipboard}>
                            <IoCopyOutline className="icon-sm" />
                            {copySuccess ? 'Zkopírováno!' : 'Kopírovat'}
                        </button>
                    </div>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon-wrapper teams">
                        <IoPeopleOutline />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{isLoading ? '...' : teamsCount}</div>
                        <div className="stat-label">Moje Týmy</div>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon-wrapper matches">
                        <IoTrophyOutline />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{isLoading ? '...' : playedMatchesCount}</div>
                        <div className="stat-label">Odehrané zápasy</div>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon-wrapper events">
                        <IoCalendarOutline />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{isLoading ? '...' : upcomingEventsCount}</div>
                        <div className="stat-label">Nadcházející události</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-info glass-card dashboard-section">
                <h2>Rychlé Akce</h2>
                <div className="action-buttons">
                    <Link href="/Dashboard/CreateTeam" className="btn-action primary">
                        <IoAddCircleOutline className="icon-md" />
                        Vytvořit Tým
                    </Link>
                    <Link href="/Dashboard/Matches/Create" className="btn-action secondary">
                        <IoTrophyOutline className="icon-md" />
                        Navrhnout Zápas
                    </Link>
                    <Link href="/Dashboard/Events/Create" className="btn-action accent">
                        <IoCalendarOutline className="icon-md" />
                        Nová Událost
                    </Link>
                </div>
            </div>

            {!isLoading && currentUser?.id && userTeamIds.length > 0 && (
                <div className="dashboard-section events-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {userTeamIds.map(teamId => (
                        <DashboardEvents key={teamId} teamId={teamId} />
                    ))}
                </div>
            )}
        </div>
    );
}