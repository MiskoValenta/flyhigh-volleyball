'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateEvent } from '@/hooks/Events/useCreateEvent';
import { useTeamsList } from '@/hooks/Teams/useTeamList';
import { CreateEventDto, EventType } from '@/types/event';
import './CreateEvent.css';

export default function CreateEventPage() {
    const router = useRouter();
    const { teams, isLoading: isLoadingTeams } = useTeamsList();
    const { handleCreateEvent, isLoading, error } = useCreateEvent();

    const [formData, setFormData] = useState<CreateEventDto>({
        teamId: '',
        title: '',
        description: '',
        type: EventType.Announcement,
        eventDate: '',
        location: '',
        invitedUserIds: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.teamId) return;

        try {
            await handleCreateEvent(formData);
            router.push(`/Dashboard/Teams/${formData.teamId}`);
        } catch (err) {
        }
    };

    return (
        <div className="CreateEventContainer">
            <div className="CreateEventCard">
                <h1 className="CreateEventTitle">Naplánovat událost</h1>

                {error && <div className="ErrorMessage">{error}</div>}

                <form className="CreateEventForm" onSubmit={onSubmit}>
                    <div className="FormGroup">
                        <label className="FormLabel">Vyberte tým</label>
                        <select
                            name="teamId"
                            className="FormSelect"
                            value={formData.teamId}
                            onChange={handleChange}
                            required
                            disabled={isLoadingTeams}
                        >
                            <option value="">-- Vyberte tým --</option>
                            {teams.map(t => (
                                <option key={t.id} value={t.id}>{t.teamName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="FormGroup">
                        <label className="FormLabel">Název události</label>
                        <input
                            type="text"
                            name="title"
                            className="FormInput"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="FormGroup">
                        <label className="FormLabel">Typ události</label>
                        <select
                            name="type"
                            className="FormSelect"
                            value={formData.type as string}
                            onChange={handleChange}
                        >
                            <option value={EventType.Announcement}>Oznámení</option>
                            <option value={EventType.Match}>Zápas</option>
                            <option value={EventType.Poll}>Anketa</option>
                        </select>
                    </div>

                    <div className="FormGroup">
                        <label className="FormLabel">Datum a čas</label>
                        <input
                            type="datetime-local"
                            name="eventDate"
                            className="FormInput"
                            value={formData.eventDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="FormGroup">
                        <label className="FormLabel">Místo konání</label>
                        <input
                            type="text"
                            name="location"
                            className="FormInput"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="FormGroup">
                        <label className="FormLabel">Popis</label>
                        <textarea
                            name="description"
                            className="FormTextarea"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <button type="submit" className="SubmitButton" disabled={isLoading || !formData.teamId}>
                        {isLoading ? 'Ukládám...' : 'Vytvořit událost'}
                    </button>
                </form>
            </div>
        </div>
    );
}