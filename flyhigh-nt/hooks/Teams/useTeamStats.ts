import { useState, useEffect } from 'react';
import { getTeamStats } from '@/lib/teamApi';
import { getTeamEvents } from '@/lib/eventApi';

export const useTeamStats = (teamId: string) => {
    const [teamMatchesPlayed, setTeamMatchesPlayed] = useState<number>(0);
    const [teamEventsCount, setTeamEventsCount] = useState<number>(0);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!teamId) {
                return;
            }

            setIsLoadingStats(true);
            try {
                const statsData = await getTeamStats(teamId);
                if (statsData.matchesPlayed !== undefined) {
                    setTeamMatchesPlayed(statsData.matchesPlayed);
                } else if (statsData.MatchesPlayed !== undefined) {
                    setTeamMatchesPlayed(statsData.MatchesPlayed);
                }

                const eventsData = await getTeamEvents(teamId);
                if (eventsData) {
                    setTeamEventsCount(eventsData.length);
                } else {
                    setTeamEventsCount(0);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchStats();
    }, [teamId]);

    return { teamMatchesPlayed, teamEventsCount, isLoadingStats };
};