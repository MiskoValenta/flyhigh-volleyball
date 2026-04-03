import { useState, useEffect, useCallback } from 'react';
import { getEventById, respondToEvent, deleteEvent } from '@/lib/eventApi';
import { TeamEvent, EventResponse } from '@/types/event';
import { useRouter } from 'next/navigation';

export function useEventDetail(eventId: string) {
    const router = useRouter();
    const [event, setEvent] = useState<TeamEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvent = useCallback(async () => {
        if (!eventId) {
            return;
        }
        setIsLoading(true);
        try {
            const data = await getEventById(eventId);
            setEvent(data);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nepodařilo se načíst detail události.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    const handleRespond = async (response: EventResponse) => {
        try {
            await respondToEvent(eventId, response);
            await fetchEvent();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nepodařilo se uložit odpověď.');
            }
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEvent(eventId);
            router.back();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nepodařilo se smazat události.');
            }
        }
    };

    return { event, isLoading, error, handleRespond, handleDelete, refreshEvent: fetchEvent };
}