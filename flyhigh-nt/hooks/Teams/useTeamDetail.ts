import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTeam, removeTeamMember } from '@/lib/teamApi';

export function useTeamDetail(teamId: string) {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteTeam = async () => {
        setIsLoading(true);
        setError('');
        try {
            await deleteTeam(teamId);
            router.push('/Dashboard/Teams');
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při mazání týmu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        setIsLoading(true);
        setError('');
        try {
            await removeTeamMember(teamId, memberId);
            window.location.reload();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při odebírání člena.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, handleDeleteTeam, handleRemoveMember };
}