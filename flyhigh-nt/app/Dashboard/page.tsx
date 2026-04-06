"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyTeams } from '@/lib/teamApi';
import { getTeamEvents } from '@/lib/eventApi';
import { getCurrentUser, getUserStats } from '@/lib/api';
import { UserProfile } from '@/types/user';
import { EventDto } from '@/types/event';
import DashboardEvents from '@/components/DashboardEvents/DashboardEvents';
import { DashboardEventItem } from '@/types/event'
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

    const [dashboardEvents, setDashboardEvents] = useState<DashboardEventItem[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                const stats = await getUserStats();
                if (stats.matchesPlayed !== undefined) {
                    setPlayedMatchesCount(stats.matchesPlayed);
                } else if (stats.MatchesPlayed !== undefined) {
                    setPlayedMatchesCount(stats.MatchesPlayed);
                }

                const myTeams = await getMyTeams();
                setTeamsCount(myTeams.length);

                const teamIds = myTeams.map(team => team.id);
                setUserTeamIds(teamIds);

                // ZMĚNA: Vytvoříme slovník pro rychlé hledání jména týmu podle ID
                const teamNameMap = new Map(myTeams.map(t => [t.id, t.teamName]));

                if (teamIds.length > 0) {
                    const allEventsPromises = teamIds.map(id => getTeamEvents(id));
                    const allEventsArrays = await Promise.allSettled(allEventsPromises);

                    const combinedEvents = allEventsArrays
                        .filter((res): res is PromiseFulfilledResult<EventDto[]> => res.status === 'fulfilled')
                        .flatMap(res => res.value);

                    const now = new Date();

                    // ZMĚNA: Přidání teamName ke každé události
                    const upcomingEvents = combinedEvents.filter(evt => {
                        if (evt.eventDate) {
                            if (new Date(evt.eventDate) > now) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }).map(evt => ({
                        ...evt,
                        teamName: teamNameMap.get(evt.teamId) || "Neznámý tým"
                    }));

                    setUpcomingEventsCount(upcomingEvents.length);
                    setDashboardEvents(upcomingEvents);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const copyToClipboard = async () => {
        if (currentUser !== null) {
            if (currentUser.id) {
                try {
                    await navigator.clipboard.writeText(currentUser.id);
                    setCopySuccess(true);
                    setTimeout(() => {
                        setCopySuccess(false);
                    }, 2000);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    };

    let subtext = "Načítám profil a data...";
    if (!isLoading) {
        if (currentUser !== null) {
            subtext = `Vítejte, ${currentUser.firstName} ${currentUser.lastName}! Zde je váš rychlý přehled.`;
        } else {
            subtext = "Vítejte! Zde je váš rychlý přehled.";
        }
    }

    let copyButtonText = 'Kopírovat';
    let copyButtonClass = 'btn-copy';
    if (copySuccess) {
        copyButtonText = 'Zkopírováno!';
        copyButtonClass = 'btn-copy success';
    }

    let userIdCard = null;
    if (currentUser !== null) {
        if (currentUser.id) {
            userIdCard = (
                <div className="user-id-card glass-card-dark">
                    <div className="user-id-text-container">
                        <h3 className="user-id-heading">Vaše uživatelské ID</h3>
                        <p className="user-id-subtext">Předejte toto ID svému trenérovi, aby vás mohl přidat do týmu.</p>
                    </div>
                    <div className="user-id-actions">
                        <code className="user-id-code hide-on-mobile">
                            {currentUser.id}
                        </code>
                        <button className={copyButtonClass} onClick={copyToClipboard}>
                            <IoCopyOutline className="icon-sm" />
                            {copyButtonText}
                        </button>
                    </div>
                </div>
            );
        }
    }

    let teamsCountDisplay = teamsCount.toString();
    let matchesCountDisplay = playedMatchesCount.toString();
    let eventsCountDisplay = upcomingEventsCount.toString();

    if (isLoading) {
        teamsCountDisplay = '...';
        matchesCountDisplay = '...';
        eventsCountDisplay = '...';
    }

    let eventsSection = null;
    if (!isLoading && currentUser?.id && userTeamIds.length > 0) {
        eventsSection = (
            <div className="dashboard-section events-section">
                <h2 className="dashboard-heading">Nadcházející události mých týmů</h2>
                <DashboardEvents events={dashboardEvents} />
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Přehled</h1>
            <p className="dashboard-subtext">{subtext}</p>

            {userIdCard}

            <div className="stats-grid">
                <div className="stat-card glass-card-dark">
                    <div className="stat-icon-wrapper teams">
                        <IoPeopleOutline />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{teamsCountDisplay}</div>
                        <div className="stat-label">Moje Týmy</div>
                    </div>
                </div>
                <div className="stat-card glass-card-dark">
                    <div className="stat-icon-wrapper matches">
                        <IoTrophyOutline />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{matchesCountDisplay}</div>
                        <div className="stat-label">Odehrané zápasy</div>
                    </div>
                </div>
                <div className="stat-card glass-card-dark">
                    <div className="stat-icon-wrapper events">
                        <IoCalendarOutline />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{eventsCountDisplay}</div>
                        <div className="stat-label">Nadcházející události</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-info glass-card-dark dashboard-section">
                <h2 className="dashboard-heading">Rychlé Akce</h2>
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

            {eventsSection}
        </div>
    );
}