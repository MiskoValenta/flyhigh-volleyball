import { useState } from 'react';
import { startMatch, startCurrentSet, assignPosition, addPoint } from '@/lib/matchApi';
import { AssignPositionDto, SetSide, PlayerPosition } from '@/types/match';

export const useLiveMatch = (matchId: string, refreshMatch: () => void) => {
    const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);

    const handleStartMatch = async () => {
        setIsLiveLoading(true);
        try {
            await startMatch(matchId);
            refreshMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při zahajování zápasu.');
            }
        } finally {
            setIsLiveLoading(false);
        }
    };

    const handleStartCurrentSet = async () => {
        setIsLiveLoading(true);
        try {
            await startCurrentSet(matchId);
            refreshMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při odstartování setu.');
            }
        } finally {
            setIsLiveLoading(false);
        }
    };

    const handleAssignPosition = async (setNumber: number, teamMemberId: string, position: PlayerPosition) => {
        setIsLiveLoading(true);
        try {
            const dto: AssignPositionDto = {
                setNumber: setNumber,
                teamMemberId: teamMemberId,
                position: position
            };
            await assignPosition(matchId, dto);
            refreshMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při přiřazování pozice.');
            }
        } finally {
            setIsLiveLoading(false);
        }
    };

    const handleAddPoint = async (side: SetSide) => {
        setIsLiveLoading(true);
        try {
            await addPoint(matchId, side);
            refreshMatch();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při přidávání bodu.');
            }
        } finally {
            setIsLiveLoading(false);
        }
    };

    return {
        isLiveLoading,
        handleStartMatch,
        handleStartCurrentSet,
        handleAssignPosition,
        handleAddPoint
    };
};