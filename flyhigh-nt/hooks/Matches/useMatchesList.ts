import { useState, useEffect, useCallback } from "react";
import { getMyMatches } from "@/lib/matchApi";
import { MatchDto, MatchStatus } from "@/types/match";

export const useMatchesList = () => {
    const [activeMatches, setActiveMatches] = useState<MatchDto[]>([]);
    const [pendingMatches, setPendingMatches] = useState<MatchDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchMatches = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await getMyMatches();

            const active = [];
            const pending = [];

            for (let i = 0; i < data.length; i++) {
                const match = data[i];

                if (match.status === MatchStatus.Rejected) {
                    // Odmítnuté zápasy vůbec nezobrazujeme
                    continue;
                }

                if (match.status === MatchStatus.Pending) {
                    pending.push(match);
                } else {
                    active.push(match);
                }
            }

            setActiveMatches(active);
            setPendingMatches(pending);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError("Chyba při načítání zápasů.");
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    return {
        activeMatches,
        pendingMatches,
        isLoading,
        error,
        refetch: fetchMatches
    };
};