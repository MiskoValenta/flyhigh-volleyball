import { useState, useEffect, useCallback } from 'react';
import { getTeamEvents } from '@/lib/eventApi';
import { EventDto } from '@/types/event';

export function useDashboardEvents(teamId?: string) {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = useCallback(async () => {
        if (!teamId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const data = await getTeamEvents(teamId);
            setEvents(data);
        } catch (err: any) {
            setError(err.message || 'Nepodařilo se načíst události.');
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, isLoading, error, refreshEvents: fetchEvents };
}