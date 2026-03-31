import { useState } from 'react';
import { startMatch, startCurrentSet, addPoint, assignPosition } from '@/lib/matchApi';

export function useLiveMatch(matchId: string) {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStartMatch = async () => {
        setIsLoading(true);
        setError('');
        try {
            await startMatch(matchId);
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při zahájení zápasu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartSet = async () => {
        setIsLoading(true);
        setError('');
        try {
            await startCurrentSet(matchId);
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při zahájení setu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPoint = async (side: string) => {
        setIsLoading(true);
        setError('');
        try {
            await addPoint(matchId, side);
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při přidávání bodu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignPosition = async (setNumber: number, teamMemberId: string, position: number) => {
        setIsLoading(true);
        setError('');
        try {
            await assignPosition(matchId, { setNumber, teamMemberId, position });
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při přidělování pozice.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, handleStartMatch, handleStartSet, handleAddPoint, handleAssignPosition };
}