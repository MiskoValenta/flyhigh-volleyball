import { useState, useEffect } from 'react';
import { getMyMatches } from '@/lib/matchApi';
import { MatchResponseDto } from '@/types/match';

export function useMatchesList() {
    const [matches, setMatches] = useState<MatchResponseDto[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getMyMatches();
                setMatches(data);
            } catch (err: any) {
                if (err.message) {
                    setError(err.message);
                } else {
                    setError('Chyba při načítání zápasů.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return { matches, error, isLoading };
}