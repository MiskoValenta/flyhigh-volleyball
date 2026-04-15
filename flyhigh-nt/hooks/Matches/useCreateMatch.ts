import { useState } from 'react';
import { createMatch } from '../../lib/matchApi';
import { CreateMatchRequest, MatchDto } from '../../types/match';

export const useCreateMatch = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateMatch = async (data: CreateMatchRequest): Promise<MatchDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const match = await createMatch(data);
            return match;
        } catch (err: any) {
            setError(err.message || 'Nastala chyba při vytváření pozvánky na zápas.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createMatch: handleCreateMatch,
        loading,
        error
    };
};