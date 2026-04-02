import { useState, useEffect, useCallback } from 'react';
import { getTeamById, removeTeamMember, addTeamMember, changeTeamMemberRole, updateTeam } from '@/lib/teamApi';
import { TeamDetail } from '@/types/team';

export const useTeamDetail = (teamId: string) => {
    const [team, setTeam] = useState<TeamDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchTeam = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getTeamById(teamId);
            setTeam(data);
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

    const handleAddMember = async (userId: string, role: string) => {
        try {
            await addTeamMember(teamId, userId, role);
            alert('Uživatel byl pozván.');
            await fetchTeam();
        } catch (err: any) {
            if (err.message) {
                alert(err.message);
            } else {
                alert('Chyba při přidávání člena.');
            }
        }
    };

    const handleChangeRole = async (userId: string, newRole: string) => {
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

    return { team, isLoading, error, handleRemoveMember, handleAddMember, handleChangeRole, handleUpdateTeam };
};