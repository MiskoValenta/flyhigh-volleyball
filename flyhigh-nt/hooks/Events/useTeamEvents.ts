import { useState, useEffect, useCallback } from 'react';
import { getTeamEvents } from '@/lib/eventApi';
import { TeamEvent } from '@/types/event';

export function useTeamEvents(teamId: string) {
    const [events, setEvents] = useState<TeamEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = useCallback(async () => {
        if (!teamId) return;
        setIsLoading(true);
        try {
            const data = await getTeamEvents(teamId);
            setEvents(data);
        } catch (err: any) {
            setError(err.message || 'Nepodařilo se načíst události týmu.');
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, isLoading, error, refreshEvents: fetchEvents };
}