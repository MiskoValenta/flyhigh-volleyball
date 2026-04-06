import { useState } from "react";
import { deleteTeam } from "@/lib/teamApi";

export const useDeleteTeam = () => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string>("");

    const removeTeam = async (teamId: string) => {
        setIsDeleting(true);
        setDeleteError("");

        try {
            await deleteTeam(teamId);
            setIsDeleting(false);
            return true;
        } catch (err: any) {
            setIsDeleting(false);
            if (err.message) {
                setDeleteError(err.message);
            } else {
                setDeleteError("Při mazání týmu došlo k neočekávané chybě.");
            }
            return false;
        }
    };

    return {
        removeTeam,
        isDeleting,
        deleteError
    };
};