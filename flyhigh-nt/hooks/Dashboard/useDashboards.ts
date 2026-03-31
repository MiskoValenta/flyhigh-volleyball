import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/apiClient';
import { getPendingInvites, acceptTeamInvite, declineTeamInvite } from '@/lib/teamApi';

export function useDashboard() {
    const [user, setUser] = useState<any>(null);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);

                const invData = await getPendingInvites();
                setInvitations(invData);
            } catch (err: any) {
                if (err.message) {
                    setError(err.message);
                } else {
                    setError('Chyba při načítání dat nástěnky.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAccept = async (teamId: string) => {
        try {
            await acceptTeamInvite(teamId);
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při přijímání pozvánky.');
            }
        }
    };

    const handleDecline = async (teamId: string) => {
        try {
            await declineTeamInvite(teamId);
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při odmítání pozvánky.');
            }
        }
    };

    return { user, invitations, error, isLoading, handleAccept, handleDecline };
}