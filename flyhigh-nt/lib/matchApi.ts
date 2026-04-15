import { fetchWithAuth } from './apiClient';
import {
    MatchDto,
    CreateMatchRequest,
    AddToRosterRequest,
    StartSetRequest,
    RecordPointRequest
} from '../types/match';

const MATCHES_URL = '/matches';

export const createMatch = async (data: CreateMatchRequest): Promise<MatchDto> => {
    const res = await fetchWithAuth(`${MATCHES_URL}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se navrhnout zápas.');
    }
    return res.json();
};

export const acceptMatch = async (matchId: string): Promise<void> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}/accept`, {
        method: 'POST',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se přijmout zápas.');
    }
};

export const rejectMatch = async (matchId: string): Promise<void> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se odmítnout zápas.');
    }
};

export const cancelMatch = async (matchId: string): Promise<void> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}/cancel`, {
        method: 'POST',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se zrušit zápas.');
    }
};

export const addReferee = async (matchId: string, refereeId: string): Promise<void> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}/referee/${refereeId}`, {
        method: 'POST',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se přidat rozhodčího.');
    }
};

export const addToRoster = async (matchId: string, data: AddToRosterRequest): Promise<void> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}/roster`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se přidat hráče na soupisku.');
    }
};

export const startNextSet = async (matchId: string, data: StartSetRequest): Promise<void> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}/sets`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se zahájit další set.');
    }
};

export const recordPoint = async (matchId: string, data: RecordPointRequest): Promise<void> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}/points`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se zaznamenat bod.');
    }
};

export const getMatchById = async (matchId: string): Promise<MatchDto> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/${matchId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se načíst detail zápasu.');
    }
    return res.json();
};

export const getTeamMatches = async (teamId: string): Promise<MatchDto[]> => {
    const res = await fetchWithAuth(`${MATCHES_URL}/team/${teamId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se načíst zápasy týmu.');
    }
    return res.json();
};