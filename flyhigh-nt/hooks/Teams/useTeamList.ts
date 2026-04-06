import { useState, useEffect, useCallback } from 'react';
import { getMyTeams } from '@/lib/teamApi';
import { TeamResponseDto, TeamMemberStatus } from '@/types/team';

export const useTeamList = () => {
    const [teams, setTeams] = useState<TeamResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchTeams = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getMyTeams();

            const activeTeams: TeamResponseDto[] = [];

            for (let i = 0; i < data.length; i++) {
                const currentTeam = data[i];

                if (currentTeam.status === TeamMemberStatus.Active) {
                    activeTeams.push(currentTeam);
                } else if (currentTeam.status === "Active") {
                    activeTeams.push(currentTeam);
                }
            }

            setTeams(activeTeams);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Nepodařilo se načíst seznam týmů.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    return { teams, isLoading, error, refreshTeams: fetchTeams };
};