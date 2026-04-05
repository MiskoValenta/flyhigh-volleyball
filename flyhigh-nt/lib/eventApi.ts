import { fetchWithAuth } from './apiClient';
import { EventDto, CreateEventDto, RespondToEventDto } from '../types/event';

const EVENT_URL = '/events';

export const createEvent = async (data: CreateEventDto): Promise<{ Id: string }> => {
    const res = await fetchWithAuth(EVENT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se vytvořit událost.');
    }

    return res.json();
};

export const getTeamEvents = async (teamId: string): Promise<EventDto[]> => {
    const res = await fetchWithAuth(`${EVENT_URL}/team/${teamId}`, {
        method: 'GET'
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se načíst události týmu.');
    }

    return res.json();
};

export const getEventDetail = async (eventId: string): Promise<EventDto> => {
    const res = await fetchWithAuth(`${EVENT_URL}/${eventId}`, {
        method: 'GET'
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se načíst detail události.');
    }

    return res.json();
};

export const respondToEvent = async (eventId: string, data: RespondToEventDto): Promise<void> => {
    const res = await fetchWithAuth(`${EVENT_URL}/${eventId}/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se odpovědět na událost.');
    }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    const res = await fetchWithAuth(`${EVENT_URL}/${eventId}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se smazat událost.');
    }
};