import { fetchWithAuth } from './apiClient';
import { Match, MatchResponseDto } from '@/types/match';

const MATCH_URL = '/matches';

export const getMyMatches = async (): Promise<MatchResponseDto[]> => {
    const res = await fetchWithAuth(`${MATCH_URL}`);
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst zápasy.');
    }
    return res.json();
}

export const getMatchById = async (matchId: string): Promise<Match> => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}`);
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst detail zápasu.');
    }
    return res.json();
}

export const proposeMatch = async (data: any) => {
    let refereeIdValue = data.refereeId;
    if (refereeIdValue === "") {
        refereeIdValue = null;
    }

    const payload = {
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        scheduledAt: data.scheduledAt,
        location: data.location,
        refereeId: refereeIdValue
    };

    const res = await fetchWithAuth(`${MATCH_URL}/propose`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else if (errorData.errors) {
            throw new Error(Object.values(errorData.errors).flat().join(' '));
        } else {
            throw new Error('Nepodařilo se vytvořit zápas.');
        }
    }
    return res.json();
}

export const acceptMatch = async (matchId: string) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/accept`, { method: 'POST' });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se přijmout zápas.');
        }
    }
}

export const rejectMatch = async (matchId: string) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/reject`, { method: 'POST' });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se odmítnout zápas.');
        }
    }
}

export const addRosterPlayer = async (matchId: string, data: any) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/roster`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se přidat hráče na soupisku.');
        }
    }
}

export const startMatch = async (matchId: string) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/start`, { method: 'POST' });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se zahájit zápas.');
        }
    }
}

export const startCurrentSet = async (matchId: string) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/sets/start`, { method: 'POST' });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se odstartovat set.');
        }
    }
}

export const addPoint = async (matchId: string, side: string) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/point/${side}`, { method: 'POST' });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se přidat bod.');
        }
    }
}

export const assignPosition = async (matchId: string, data: any) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/positions`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se přiřadit pozici.');
        }
    }
}

export const setReferee = async (matchId: string, refereeId: string) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/referee/${refereeId}`, {
        method: 'POST'
    });

    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se nastavit rozhodčího.');
        }
    }
}

export const cancelMatch = async (matchId: string, reason: string) => {
    const res = await fetchWithAuth(`${MATCH_URL}/${matchId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
    });

    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }

        if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error('Nepodařilo se zrušit zápas.');
        }
    }
}