import { useState, useEffect, useCallback } from 'react';
import {
    getMatchById, acceptMatch, rejectMatch, cancelMatch, addReferee, addToRoster
} from '../../lib/matchApi';
import { MatchDto, AddToRosterRequest } from '../../types/match';

export const useMatchDetail = (matchId: string) => {
    const [match, setMatch] = useState<MatchDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    const fetchMatch = useCallback(async () => {
        if (!matchId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getMatchById(matchId);
            setMatch(data);
        } catch (err: any) {
            setError(err.message || 'Nastala chyba při načítání detailu zápasu.');
        } finally {
            setLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    const handleAccept = async () => {
        setActionLoading(true);
        try {
            await acceptMatch(matchId);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při přijímání zápasu.');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            await rejectMatch(matchId);
            setMatch(null);
        } catch (err: any) {
            setError(err.message || 'Chyba při odmítání zápasu.');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        setActionLoading(true);
        try {
            await cancelMatch(matchId);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při rušení zápasu.');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddReferee = async (refereeId: string) => {
        setActionLoading(true);
        try {
            await addReferee(matchId, refereeId);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při přidávání rozhodčího.');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddToRoster = async (data: AddToRosterRequest) => {
        setActionLoading(true);
        try {
            await addToRoster(matchId, data);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při přidávání hráče na soupisku.');
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
        acceptMatch: handleAccept,
        rejectMatch: handleReject,
        cancelMatch: handleCancel,
        addReferee: handleAddReferee,
        addToRoster: handleAddToRoster
    };
};