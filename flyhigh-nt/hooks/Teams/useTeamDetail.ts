import { useState, useEffect, useCallback } from 'react';
import {
    getTeamById,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    changeTeamMemberRole
} from '@/lib/teamApi';
import { TeamDetail, UpdateTeamDto } from '@/types/team';

export function useTeamDetail(teamId: string) {
    const [team, setTeam] = useState<TeamDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTeam = useCallback(async () => {
        if (!teamId) return;
        setIsLoading(true);
        setError('');
        try {
            const data = await getTeamById(teamId);
            setTeam(data);
        } catch (err: any) {
            setError(err.message || 'Nepodařilo se načíst detail týmu.');
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    const handleUpdateTeam = async (data: UpdateTeamDto) => {
        try {
            await updateTeam(teamId, data);
            await fetchTeam();
        } catch (err: any) {
            throw new Error(err.message || 'Nepodařilo se upravit tým.');
        }
    };

    const handleDeleteTeam = async () => {
        try {
            await deleteTeam(teamId);
        } catch (err: any) {
            throw new Error(err.message || 'Nepodařilo se smazat tým.');
        }
    };

    const handleAddMember = async (userId: string, role: string | number) => {
        try {
            await addTeamMember(teamId, userId, role);
            await fetchTeam();
        } catch (err: any) {
            throw new Error(err.message || 'Nepodařilo se pozvat člena.');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeTeamMember(teamId, userId);
            await fetchTeam();
        } catch (err: any) {
            throw new Error(err.message || 'Nepodařilo se odebrat člena.');
        }
    };

    const handleChangeRole = async (memberId: string, newRole: string | number) => {
        try {
            await changeTeamMemberRole(teamId, memberId, newRole);
            await fetchTeam();
        } catch (err: any) {
            throw new Error(err.message || 'Nepodařilo se změnit roli.');
        }
    };

    return {
        team,
        isLoading,
        error,
        refreshTeam: fetchTeam,
        handleUpdateTeam,
        handleDeleteTeam,
        handleAddMember,
        handleRemoveMember,
        handleChangeRole
    };
}