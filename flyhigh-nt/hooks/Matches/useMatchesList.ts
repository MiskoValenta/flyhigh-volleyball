import { useState, useEffect, useCallback } from "react";
import { getMyMatches, acceptMatch, rejectMatch } from "../../lib/matchApi";
import { MatchDto } from "../../types/match";

export const useMatchesList = () => {
    const [matches, setMatches] = useState<MatchDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getMyMatches();
            setMatches(data);
        } catch (err: any) {
            setError(err.message || "Nepodařilo se načíst seznam zápasů.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    const handleAccept = async (matchId: string) => {
        try {
            await acceptMatch(matchId);
            await fetchMatches();
        } catch (err: any) {
            alert(err.message || "Nepodařilo se přijmout výzvu k zápasu.");
        }
    };

    const handleReject = async (matchId: string) => {
        try {
            await rejectMatch(matchId);
            await fetchMatches();
        } catch (err: any) {
            alert(err.message || "Nepodařilo se odmítnout výzvu k zápasu.");
        }
    };

    return { matches, isLoading, error, refetch: fetchMatches, handleAccept, handleReject };
};