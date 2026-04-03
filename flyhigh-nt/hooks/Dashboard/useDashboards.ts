import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '@/lib/api';
import { getPendingInvitations, acceptInvitation, declineInvitation } from '@/lib/teamApi';
import { UserProfile } from '@/types/user';
import { PendingInvitationDto } from '@/types/team';

export function useDashboard() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [invitations, setInvitations] = useState<PendingInvitationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const userData = await getCurrentUser();
            setUser(userData);

            const invitesData = await getPendingInvitations();
            setInvitations(invitesData);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nepodařilo se načíst data pro nástěnku.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAcceptInvitation = async (teamId: string) => {
        try {
            await acceptInvitation(teamId);
            await fetchData();
        } catch (err: any) {
            if (err.message) {
                throw new Error(err.message);
            } else {
                throw new Error('Nepodařilo se přijmout pozvánku.');
            }
        }
    };

    const handleDeclineInvitation = async (teamId: string) => {
        try {
            await declineInvitation(teamId);
            await fetchData();
        } catch (err: any) {
            if (err.message) {
                throw new Error(err.message);
            } else {
                throw new Error('Nepodařilo se odmítnout pozvánku.');
            }
        }
    };

    return {
        user,
        invitations,
        isLoading,
        error,
        refreshDashboard: fetchData,
        handleAcceptInvitation,
        handleDeclineInvitation
    };
}