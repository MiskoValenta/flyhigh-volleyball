import { useState } from "react";
import { proposeMatch } from "@/lib/matchApi";
import { CreateMatchDto } from "@/types/match";

export const useCreateMatch = () => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string>("");

    const createNewMatch = async (data: CreateMatchDto) => {
        setIsCreating(true);
        setCreateError("");
        try {
            const newMatch = await proposeMatch(data);
            setIsCreating(false);
            return newMatch;
        } catch (err: any) {
            setIsCreating(false);
            if (err.message) {
                setCreateError(err.message);
            } else {
                setCreateError("Nepodařilo se vytvořit zápas.");
            }
            return null;
        }
    };

    return {
        createNewMatch,
        isCreating,
        createError
    };
};