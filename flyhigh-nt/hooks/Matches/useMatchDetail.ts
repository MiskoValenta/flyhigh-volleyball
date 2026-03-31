import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptMatch, rejectMatch, addRosterPlayer } from '@/lib/matchApi';

export function useMatchDetail(matchId: string) {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {
        setIsLoading(true);
        setError('');
        try {
            await acceptMatch(matchId);
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při přijímání zápasu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        setError('');
        try {
            await rejectMatch(matchId);
            router.push('/Dashboard/Matches');
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při odmítání zápasu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRoster = async (teamMemberId: string, teamId: string, jerseyNumber: number) => {
        setIsLoading(true);
        setError('');
        try {
            await addRosterPlayer(matchId, { teamMemberId, teamId, jerseyNumber });
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při přidávání na soupisku.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        error,
        isLoading,
        handleAccept,
        handleReject,
        handleAddRoster
    };
}