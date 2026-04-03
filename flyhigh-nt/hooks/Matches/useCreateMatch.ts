import { useState } from 'react';
import { proposeMatch } from '@/lib/matchApi';
import { CreateMatchDto } from '@/types/match';

export const useCreateMatch = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleCreateMatch = async (data: CreateMatchDto) => {
        setIsLoading(true);
        setError('');
        try {
            const result = await proposeMatch(data);
            return result;
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nastala neočekávaná chyba při vytváření zápasu.');
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateMatch, isLoading, error };
};