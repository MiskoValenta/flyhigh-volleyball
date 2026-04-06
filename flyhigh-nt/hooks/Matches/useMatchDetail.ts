import { useState, useEffect, useCallback } from 'react';
import { getMatchById, acceptMatch, rejectMatch, cancelMatch, addRosterPlayer, setReferee } from '@/lib/matchApi';
import { MatchDetail, RosterPlayerDto } from '@/types/match';
import { getCurrentUser } from '@/lib/api';

export const useMatchDetail = (matchId: string) => {
    const [match, setMatch] = useState<MatchDetail | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchMatch = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getMatchById(matchId);
            setMatch(data);
            const user = await getCurrentUser();
            setCurrentUserId(user.id);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nastala chyba při načítání zápasu.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        if (matchId) {
            fetchMatch();
        }
    }, [matchId, fetchMatch]);

    const handleAcceptMatch = async () => {
        try {
            await acceptMatch(matchId);
            await fetchMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při přijímání zápasu.');
            }
        }
    };

    const handleRejectMatch = async () => {
        try {
            await rejectMatch(matchId);
            await fetchMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při odmítání zápasu.');
            }
        }
    };

    const handleCancelMatch = async (reason: string) => {
        try {
            await cancelMatch(matchId, reason);
            await fetchMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při rušení zápasu.');
            }
        }
    };

    const handleAddRosterPlayer = async (teamMemberId: string, teamId: string, jerseyNumber: number) => {
        try {
            const dto: RosterPlayerDto = {
                teamMemberId: teamMemberId,
                teamId: teamId,
                jerseyNumber: jerseyNumber
            };
            await addRosterPlayer(matchId, dto);
            await fetchMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při přidávání hráče na soupisku.');
            }
        }
    };

    const handleSetReferee = async (refereeId: string) => {
        try {
            await setReferee(matchId, refereeId);
            await fetchMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při nastavování rozhodčího.');
            }
        }
    };

    return {
        match,
        currentUserId,
        isLoading,
        error,
        refreshMatch: fetchMatch,
        handleAcceptMatch,
        handleRejectMatch,
        handleCancelMatch,
        handleAddRosterPlayer,
        handleSetReferee
    };
};