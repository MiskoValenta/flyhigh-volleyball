import { fetchWithAuth } from "./apiClient";
import {
    MatchDto,
    ProposeMatchDto,
    AddRosterEntryDto,
    StartSetDto,
    RecordPointDto
} from "../types/match";

const BASE_URL = '/matches';

export const getMyMatches = async (): Promise<MatchDto[]> => {
    const res = await fetchWithAuth(`${BASE_URL}/my`, {
        method: 'GET'
    });
    return await res.json();
};

export const getMatchById = async (matchId: string): Promise<MatchDto> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}`, {
        method: 'GET'
    });
    return await res.json();
};

export const proposeMatch = async (dto: ProposeMatchDto): Promise<string> => {
    const res = await fetchWithAuth(`${BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify(dto)
    });

    const data = await res.json();
    return data.matchId;
};

export const acceptMatch = async (matchId: string): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/accept`, {
        method: 'POST'
    });
};

export const rejectMatch = async (matchId: string): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/reject`, {
        method: 'POST'
    });
};

export const addRosterEntry = async (matchId: string, dto: AddRosterEntryDto): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/roster`, {
        method: 'POST',
        body: JSON.stringify(dto)
    });
};

export const removeRosterEntry = async (matchId: string, entryId: string): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/roster/${entryId}`, {
        method: 'DELETE'
    });
};

export const startMatch = async (matchId: string): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/start`, {
        method: 'POST'
    });
};

export const startNextSet = async (matchId: string, dto: StartSetDto): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/sets`, {
        method: 'POST',
        body: JSON.stringify(dto)
    });
};

export const recordPoint = async (matchId: string, dto: RecordPointDto): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/points`, {
        method: 'POST',
        body: JSON.stringify(dto)
    });
};

export const cancelMatch = async (matchId: string): Promise<void> => {
    await fetchWithAuth(`${BASE_URL}/${matchId}/cancel`, {
        method: 'POST'
    });
};