import { useState, useEffect, useCallback } from 'react';
import { getMatchById, startNextSet, recordPoint } from '../../lib/matchApi';
import { MatchDto, StartSetRequest, RecordPointRequest } from '../../types/match';

export const useLiveMatch = (matchId: string) => {
    const [match, setMatch] = useState<MatchDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    const fetchMatch = useCallback(async () => {
        if (!matchId) return;
        if (!match) setLoading(true);
        setError(null);
        try {
            const data = await getMatchById(matchId);
            setMatch(data);
        } catch (err: any) {
            setError(err.message || 'Nastala chyba při načítání live zápasu.');
        } finally {
            setLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        fetchMatch();
        const interval = setInterval(() => {
            fetchMatch();
        }, 10000);
        return () => clearInterval(interval);
    }, [fetchMatch]);

    const handleStartNextSet = async (data: StartSetRequest) => {
        setActionLoading(true);
        try {
            await startNextSet(matchId, data);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při zahajování setu.');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const handleRecordPoint = async (data: RecordPointRequest) => {
        setActionLoading(true);
        try {
            await recordPoint(matchId, data);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při zapisování bodu.');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    return {
        match,
        loading,
        error,
        actionLoading,
        refetch: fetchMatch,
        startNextSet: handleStartNextSet,
        recordPoint: handleRecordPoint
    };
};