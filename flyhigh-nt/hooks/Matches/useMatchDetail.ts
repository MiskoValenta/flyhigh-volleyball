import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    getMatchById,
    acceptMatch,
    rejectMatch,
    addRosterPlayer,
    cancelMatch,
    setReferee
} from '@/lib/matchApi';
import { Match } from '@/types/match';

export function useMatchDetail(matchId: string) {
    const router = useRouter();
    const [match, setMatch] = useState<Match | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchMatch = useCallback(async () => {
        if (!matchId) return;
        setIsLoading(true);
        setError('');
        try {
            const data = await getMatchById(matchId);
            setMatch(data);
        } catch (err: any) {
            setError(err.message || 'Nepodařilo se načíst detail zápasu.');
        } finally {
            setIsLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    const handleAccept = async () => {
        try {
            await acceptMatch(matchId);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při přijímání zápasu.');
        }
    };

    const handleReject = async () => {
        try {
            await rejectMatch(matchId);
            router.push('/Dashboard/Matches');
        } catch (err: any) {
            setError(err.message || 'Chyba při odmítání zápasu.');
        }
    };

    const handleAddRoster = async (teamMemberId: string, teamId: string, jerseyNumber: number) => {
        try {
            await addRosterPlayer(matchId, { teamMemberId, teamId, jerseyNumber });
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při přidávání na soupisku.');
        }
    };

    const handleCancel = async (reason: string) => {
        try {
            await cancelMatch(matchId, reason);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při rušení zápasu.');
        }
    };

    const handleSetReferee = async (refereeId: string) => {
        try {
            await setReferee(matchId, refereeId);
            await fetchMatch();
        } catch (err: any) {
            setError(err.message || 'Chyba při nastavování rozhodčího.');
        }
    };

    return {
        match,
        error,
        isLoading,
        refreshMatch: fetchMatch,
        handleAccept,
        handleReject,
        handleAddRoster,
        handleCancel,
        handleSetReferee
    };
}