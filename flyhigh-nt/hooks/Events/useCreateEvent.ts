import { useState } from 'react';
import { createEvent } from '@/lib/eventApi';
import { CreateEventDto } from '@/types/event';

export const useCreateEvent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleCreateEvent = async (data: CreateEventDto) => {
        setIsLoading(true);
        setError('');
        try {
            const result = await createEvent(data);
            return result;
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nastala neočekávaná chyba při vytváření události.');
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateEvent, isLoading, error };
};