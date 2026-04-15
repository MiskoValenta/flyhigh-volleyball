import { useState } from "react";
import { useRouter } from "next/navigation";
import { proposeMatch } from "../../lib/matchApi";
import { ProposeMatchDto } from "../../types/match";

export const useCreateMatch = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreate = async (dto: ProposeMatchDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const newMatchId = await proposeMatch(dto);
            router.push(`/Dashboard/Matches/${newMatchId}`);
        } catch (err: any) {
            setError(err.message || "Chyba při vytváření výzvy k zápasu.");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreate, isLoading, error };
};