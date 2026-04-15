import { useState, useEffect, useCallback } from 'react';
import { getTeamMatches } from '../../lib/matchApi';
import { MatchDto } from '../../types/match';

export const useMatchesList = (teamId: string) => {
    const [matches, setMatches] = useState<MatchDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = useCallback(async () => {
        if (!teamId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getTeamMatches(teamId);
            setMatches(data);
        } catch (err: any) {
            setError(err.message || 'Nastala chyba při načítání seznamu zápasů.');
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    return {
        matches,
        loading,
        error,
        refetch: fetchMatches
    };
};