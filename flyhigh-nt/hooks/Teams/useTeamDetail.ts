import { useState, useEffect, useCallback } from 'react';
import { getTeamById, removeTeamMember, addTeamMember, changeTeamMemberRole, updateTeam } from '@/lib/teamApi';
import { getCurrentUser } from '@/lib/api';
import { TeamDetail, TeamRole } from '@/types/team';

export const useTeamDetail = (teamId: string) => {
    const [team, setTeam] = useState<TeamDetail | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchTeam = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getTeamById(teamId);
            setTeam(data);
            const user = await getCurrentUser();
            setCurrentUserId(user.id);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nastala chyba při načítání týmu.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        if (teamId) {
            fetchTeam();
        }
    }, [teamId, fetchTeam]);

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeTeamMember(teamId, userId);
            await fetchTeam();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při odebírání člena.');
            }
        }
    };

    const handleAddMember = async (userId: string, role: TeamRole) => {
        try {
            await addTeamMember(teamId, userId, role);
            alert('Uživatel byl úspěšně pozván do týmu.');
            await fetchTeam();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při přidávání člena.');
            }
        }
    };

    const handleChangeRole = async (userId: string, newRole: TeamRole) => {
        try {
            await changeTeamMemberRole(teamId, userId, newRole);
            alert('Role byla úspěšně změněna.');
            await fetchTeam();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při změně role.');
            }
        }
    };

    const handleUpdateTeam = async (data: { teamName: string; abbreviation: string; description: string }) => {
        try {
            await updateTeam(teamId, data);
            alert('Tým byl aktualizován.');
            await fetchTeam();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při aktualizaci týmu.');
            }
        }
    };

    return { team, currentUserId, isLoading, error, handleRemoveMember, handleAddMember, handleChangeRole, handleUpdateTeam };
};