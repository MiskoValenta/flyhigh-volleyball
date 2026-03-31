import { useState } from 'react';
import { createEvent } from '@/lib/eventApi';
import { CreateEventDto } from '@/types/event';

export function useCreateEvent() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateEvent = async (eventData: CreateEventDto) => {
        setIsLoading(true);
        setError('');
        try {
            const result = await createEvent(eventData);
            return result;
        } catch (err: any) {
            setError(err.message || 'Nepodařilo se vytvořit událost.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateEvent, isLoading, error };
}