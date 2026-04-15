import { useState, useEffect, useCallback } from "react";
import { getMatchById, addRosterEntry, removeRosterEntry } from "../../lib/matchApi";
import { MatchDto, AddRosterEntryDto } from "../../types/match";

export const useMatchDetail = (matchId: string, enablePolling: boolean = false) => {
    const [match, setMatch] = useState<MatchDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatch = useCallback(async () => {
        if (!matchId) return;
        try {
            const data = await getMatchById(matchId);
            setMatch(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Nepodařilo se načíst detail zápasu.");
        } finally {
            setIsLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        fetchMatch();

        let intervalId: NodeJS.Timeout;
        if (enablePolling) {
            intervalId = setInterval(() => {
                fetchMatch();
            }, 3000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [fetchMatch, enablePolling]);

    const handleAddRoster = async (dto: AddRosterEntryDto) => {
        try {
            await addRosterEntry(matchId, dto);
            await fetchMatch();
        } catch (err: any) {
            throw new Error(err.message || "Chyba při přidávání hráče na soupisku.");
        }
    };

    const handleRemoveRoster = async (entryId: string) => {
        try {
            await removeRosterEntry(matchId, entryId);
            await fetchMatch();
        } catch (err: any) {
            throw new Error(err.message || "Chyba při odebírání hráče ze soupisky.");
        }
    };

    return {
        match,
        isLoading,
        error,
        refetch: fetchMatch,
        handleAddRoster,
        handleRemoveRoster
    };
};