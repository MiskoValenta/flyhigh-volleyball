import { useState, useEffect, useCallback } from 'react';
import { getEventDetail, respondToEvent, deleteEvent } from '@/lib/eventApi';
import { EventDto, EventResponse } from '@/types/event';
import { useRouter } from 'next/navigation';

export const useEventDetail = (eventId: string) => {
    const [event, setEvent] = useState<EventDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchDetail = useCallback(async () => {
        if (!eventId) return;
        setIsLoading(true);
        try {
            const data = await getEventDetail(eventId);
            setEvent(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);

    useEffect(() => { fetchDetail(); }, [fetchDetail]);

    const handleRespond = async (response: EventResponse) => {
        try {
            await respondToEvent(eventId, { response });
            fetchDetail();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (teamId: string) => {
        if (!window.confirm("Opravdu chcete smazat tuto událost?")) return;
        try {
            await deleteEvent(eventId);
            router.push(`/Dashboard/Teams/${teamId}`);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return { event, isLoading, error, handleRespond, handleDelete, refetch: fetchDetail };
};