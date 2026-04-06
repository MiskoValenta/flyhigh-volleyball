import { useState, useEffect, useCallback } from 'react';
import { getTeamEvents } from '@/lib/eventApi';
import { EventDto } from '@/types/event';

export const useTeamEvents = (teamId: string) => {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!teamId) return;
        setIsLoading(true);
        try {
            const data = await getTeamEvents(teamId);
            setEvents(data);
        } catch (err: any) {
            setError(err.message || "Nepodařilo se načíst události.");
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    return { events, isLoading, error, refetch: fetchEvents };
};