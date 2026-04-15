import { useState } from "react";
import { startMatch, startNextSet, recordPoint, cancelMatch } from "../../lib/matchApi";
import { StartSetDto, RecordPointDto } from "../../types/match";

export const useLiveMatch = (matchId: string, onSuccess?: () => void) => {
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

    const runAction = async (apiCall: () => Promise<void>) => {
        setIsActionLoading(true);
        try {
            await apiCall();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            alert(err.message || "Akce selhala. Zkuste to prosím znovu.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleStartMatch = () => runAction(() => startMatch(matchId));

    const handleStartNextSet = (dto: StartSetDto) => runAction(() => startNextSet(matchId, dto));

    const handleRecordPoint = (dto: RecordPointDto) => runAction(() => recordPoint(matchId, dto));

    const handleCancelMatch = () => runAction(() => cancelMatch(matchId));

    return {
        handleStartMatch,
        handleStartNextSet,
        handleRecordPoint,
        handleCancelMatch,
        isActionLoading
    };
};