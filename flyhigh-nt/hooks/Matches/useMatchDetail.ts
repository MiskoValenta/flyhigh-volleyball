import { useState, useCallback, useEffect } from "react";
import {
    getMatchById,
    acceptMatch,
    rejectMatch,
    addRosterPlayer,
    setReferee,
    cancelMatch
} from "@/lib/matchApi";
import { MatchDto, RosterPlayerDto } from "@/types/match";

export const useMatchDetail = (matchId: string) => {
    const [match, setMatch] = useState<MatchDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchMatch = useCallback(async () => {
        if (!matchId) {
            return;
        }
        if (matchId === "") {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const data = await getMatchById(matchId);
            setMatch(data);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError("Nepodařilo se načíst detail zápasu.");
            }
        }
        setIsLoading(false);
    }, [matchId]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    const handleAccept = async () => {
        try {
            await acceptMatch(matchId);
            await fetchMatch();
        } catch (err: any) {
            throw err;
        }
    };

    const handleReject = async () => {
        try {
            await rejectMatch(matchId);
            await fetchMatch();
        } catch (err: any) {
            throw err;
        }
    };

    const handleAddPlayer = async (data: RosterPlayerDto) => {
        try {
            await addRosterPlayer(matchId, data);
            await fetchMatch();
        } catch (err: any) {
            throw err;
        }
    };

    const handleSetReferee = async (refereeId: string) => {
        try {
            await setReferee(matchId, refereeId);
            await fetchMatch();
        } catch (err: any) {
            throw err;
        }
    };

    const handleCancel = async (reason: string) => {
        try {
            await cancelMatch(matchId, reason);
            await fetchMatch();
        } catch (err: any) {
            throw err;
        }
    };

    return {
        match,
        isLoading,
        error,
        fetchMatch,
        handleAccept,
        handleReject,
        handleAddPlayer,
        handleSetReferee,
        handleCancel
    };
};