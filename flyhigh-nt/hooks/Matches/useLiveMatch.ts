import { useState } from "react";
import {
    startMatch,
    startCurrentSet,
    addPoint,
    assignPosition
} from "@/lib/matchApi";
import { SetSide, AssignPositionDto } from "@/types/match";

export const useLiveMatch = (matchId: string, onUpdateCallback: () => void) => {
    const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
    const [liveError, setLiveError] = useState<string>("");

    const handleStartMatch = async () => {
        setIsLiveLoading(true);
        setLiveError("");
        try {
            await startMatch(matchId);
            onUpdateCallback();
        } catch (err: any) {
            if (err.message) {
                setLiveError(err.message);
            } else {
                setLiveError("Nepodařilo se odstartovat zápas.");
            }
        }
        setIsLiveLoading(false);
    };

    const handleStartSet = async () => {
        setIsLiveLoading(true);
        setLiveError("");
        try {
            await startCurrentSet(matchId);
            onUpdateCallback();
        } catch (err: any) {
            if (err.message) {
                setLiveError(err.message);
            } else {
                setLiveError("Nepodařilo se odstartovat set.");
            }
        }
        setIsLiveLoading(false);
    };

    const handleAddPoint = async (side: SetSide) => {
        setIsLiveLoading(true);
        setLiveError("");
        try {
            await addPoint(matchId, side);
            onUpdateCallback();
        } catch (err: any) {
            if (err.message) {
                setLiveError(err.message);
            } else {
                setLiveError("Nepodařilo se přidat bod.");
            }
        }
        setIsLiveLoading(false);
    };

    const handleAssignPosition = async (data: AssignPositionDto) => {
        setIsLiveLoading(true);
        setLiveError("");
        try {
            await assignPosition(matchId, data);
            onUpdateCallback();
        } catch (err: any) {
            if (err.message) {
                setLiveError(err.message);
            } else {
                setLiveError("Nepodařilo se přiřadit pozici.");
            }
        }
        setIsLiveLoading(false);
    };

    return {
        isLiveLoading,
        liveError,
        handleStartMatch,
        handleStartSet,
        handleAddPoint,
        handleAssignPosition
    };
};