import { useState, useEffect, useCallback } from 'react';
import { getMyMatches } from '@/lib/matchApi';
import { MatchResponseDto } from '@/types/match';

export const useMatchesList = () => {
    const [matches, setMatches] = useState<MatchResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchMatches = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getMyMatches();
            setMatches(data);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nepodařilo se načíst seznam zápasů.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    return { matches, isLoading, error, refreshMatches: fetchMatches };
};