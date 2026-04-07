import { useState, useEffect, useCallback } from "react";
import { getMyMatches } from "@/lib/matchApi";
import { getTeamById } from "@/lib/teamApi";
import { fetchWithAuth } from "@/lib/apiClient";
import { MatchStatus, MatchEnhanced } from "@/types/match";
import { useProfile } from "@/hooks/Profile/useProfile";

export const useMatchesList = () => {
    const { user } = useProfile();
    const [activeMatches, setActiveMatches] = useState<MatchEnhanced[]>([]);
    const [pendingMatches, setPendingMatches] = useState<MatchEnhanced[]>([]);
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
                    continue;
                }

                let hName = match.homeTeamId;
                let hAbbr = "DOM";
                try {
                    const hTeam = await getTeamById(match.homeTeamId);
                    hName = hTeam.teamName;
                    if (hTeam.shortName) {
                        hAbbr = hTeam.shortName;
                    }
                } catch (e) {
                }

                let aName = match.awayTeamId;
                let aAbbr = "HOS";
                try {
                    const aTeam = await getTeamById(match.awayTeamId);
                    aName = aTeam.teamName;
                    if (aTeam.shortName) {
                        aAbbr = aTeam.shortName;
                    }
                } catch (e) {
                }

                let cName = match.creatorId;
                if (match.creatorId) {
                    try {
                        const creatorRes = await fetchWithAuth(`/Users/${match.creatorId}`);
                        if (creatorRes.ok) {
                            const creatorUser = await creatorRes.json();
                            if (creatorUser) {
                                if (creatorUser.firstName) {
                                    cName = creatorUser.firstName + " " + creatorUser.lastName;
                                }
                            }
                        }
                    } catch (e) {
                    }
                }

                const enhancedMatch: MatchEnhanced = {
                    ...match,
                    homeTeamName: hName,
                    homeTeamAbbr: hAbbr,
                    awayTeamName: aName,
                    awayTeamAbbr: aAbbr,
                    creatorName: cName
                };

                if (match.status === MatchStatus.Pending) {
                    pending.push(enhancedMatch);
                } else {
                    active.push(enhancedMatch);
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
        refetch: fetchMatches,
        profile: user
    };
};