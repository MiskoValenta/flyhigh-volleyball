import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/eventApi';
import { CreateEventDto } from '@/types/event';

export const useCreateEvent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreateEvent = async (data: CreateEventDto) => {
        setIsLoading(true);
        setError(null);
        try {
            await createEvent(data);
            router.push(`/Dashboard/Teams/${data.teamId}`);
            return true;
        } catch (err: any) {
            setError(err.message || "Chyba při vytváření události.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateEvent, isLoading, error };
};