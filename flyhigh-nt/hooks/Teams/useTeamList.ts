import { useState, useEffect } from 'react';
import { getMyTeams } from '@/lib/teamApi';
import { Team } from '@/types/team';

export function useTeamsList() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await getMyTeams();
                setTeams(data);
            } catch (err: any) {
                if (err.message) {
                    setError(err.message);
                } else {
                    setError('Chyba při načítání týmů.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, []);

    return { teams, error, isLoading };
}