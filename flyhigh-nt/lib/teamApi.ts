import { fetchWithAuth } from './apiClient';
import { TeamResponseDto, TeamDetail, CreateTeamDto, UpdateTeamDto, PendingInvitationDto, TeamRole } from '@/types/team';

const TEAM_URL = '/teams';

export const getMyTeams = async (): Promise<TeamResponseDto[]> => {
    const res = await fetchWithAuth(`${TEAM_URL}`);
    if (!res.ok) {
        return [];
    }
    return res.json();
};

export const getTeamById = async (teamId: string): Promise<TeamDetail> => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}`);
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst detaily týmu.');
    }
    return res.json();
};

export const createTeam = async (data: CreateTeamDto) => {
    const res = await fetchWithAuth(`${TEAM_URL}/create`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se vytvořit tým.');
    }
    return res.json();
};

export const updateTeam = async (teamId: string, data: UpdateTeamDto) => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se upravit tým.');
    }
};

export const removeTeamMember = async (teamId: string, userId: string) => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/members/${userId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se odebrat člena.');
    }
};

export const addTeamMember = async (teamId: string, userId: string, role: TeamRole) => {
    const cleanId = userId.trim();
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!guidRegex.test(cleanId)) {
        throw new Error("Zadané ID není ve správném formátu platného uživatelského ID.");
    }

    const payload = {
        targetId: cleanId,
        setRole: role
    };

    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/members`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        let errorMessage = 'Nepodařilo se pozvat člena.';
        if (errorData.message) {
            errorMessage = errorData.message;
        } else if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(' ');
        }

        throw new Error(errorMessage);
    }

    const text = await res.text();
    if (text !== '') {
        return JSON.parse(text);
    } else {
        return {};
    }
};

export const changeTeamMemberRole = async (teamId: string, userId: string, newRole: TeamRole) => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/members/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ newRole }),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se změnit roli.');
    }
};

export const getPendingInvitations = async (): Promise<PendingInvitationDto[]> => {
    const res = await fetchWithAuth(`${TEAM_URL}/invites/pending`);
    if (!res.ok) {
        return [];
    }
    return res.json();
};

export const acceptInvitation = async (teamId: string) => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/invites/accept`, {
        method: 'PATCH',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se přijmout pozvánku.');
    }
};

export const declineInvitation = async (teamId: string) => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/invites/decline`, {
        method: 'PATCH',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se odmítnout pozvánku.');
    }
};

export const getTeamStats = async (teamId: string): Promise<{ matchesPlayed: number; MatchesPlayed?: number }> => {
    const res = await fetchWithAuth(`/teams/${teamId}/stats`);
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst statistiky týmu.');
    }
    return res.json();
};

export const deleteTeam = async (teamId: string): Promise<void> => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        throw new Error(
            errorData.message || 'Nepodařilo se smazat tým.'
        );
    }
};