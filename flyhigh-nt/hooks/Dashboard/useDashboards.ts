import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '@/lib/api';
import { getPendingInvites, acceptTeamInvite, declineTeamInvite } from '@/lib/teamApi';
import { UserProfile } from '@/types/user';
import { PendingInvitationDto } from '@/types/team';

export function useDashboard() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [invitations, setInvitations] = useState<PendingInvitationDto[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const [userData, invData] = await Promise.all([
                getCurrentUser(),
                getPendingInvites()
            ]);

            setUser(userData);
            setInvitations(invData);
        } catch (err: any) {
            setError(err.message || 'Chyba při načítání dat nástěnky.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAccept = async (teamId: string) => {
        try {
            await acceptTeamInvite(teamId);
            setInvitations(prev => prev.filter(inv => inv.teamId !== teamId));
        } catch (err: any) {
            setError(err.message || 'Chyba při přijímání pozvánky.');
        }
    };

    const handleDecline = async (teamId: string) => {
        try {
            await declineTeamInvite(teamId);
            setInvitations(prev => prev.filter(inv => inv.teamId !== teamId));
        } catch (err: any) {
            setError(err.message || 'Chyba při odmítání pozvánky.');
        }
    };

    return { user, invitations, error, isLoading, handleAccept, handleDecline, refreshDashboard: fetchData };
}