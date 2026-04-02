import { fetchWithAuth } from './apiClient';
import { TeamEvent, EventResponse, CreateEventDto } from '@/types/event';

const BASE_URL = '/events';

export const createEvent = async (data: CreateEventDto) => {
    const payload = {
        teamId: data.teamId,
        title: data.title,
        description: data.description || "",
        type: data.type,
        eventDate: data.eventDate || null,
        location: data.location || "",
        invitedUserIds: data.invitedUserIds || []
    };

    const res = await fetchWithAuth(`${BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) {
        }

        let errorMessage = 'Nepodařilo se vytvořit událost.';

        if (errorData.message) {
            errorMessage = errorData.message;
        } else if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(' ');
        }

        throw new Error(errorMessage);
    }
    const text = await res.text();
    if (text !== "") {
        return JSON.parse(text);
    } else {
        return {};
    }
};

export const getTeamEvents = async (teamId: string): Promise<TeamEvent[]> => {
    const res = await fetchWithAuth(`${BASE_URL}/team/${teamId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        return [];
    }
    return res.json();
}

export const getEventById = async (eventId: string): Promise<TeamEvent> => {
    const res = await fetchWithAuth(`${BASE_URL}/${eventId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst detail události.');
    }
    return res.json();
}

export const respondToEvent = async (eventId: string, response: EventResponse | string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${eventId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ response })
    });
    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se uložit odpověď.');
    }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${eventId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch (e) { }
        throw new Error(errorData.message || 'Nepodařilo se smazat událost.');
    }
};