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
            console.error("Vytvoření události selhalo.");
        }
    };

    return (
        <div className="createevent">
            <div className="create-event-header">
                <h1 className="create-event-heading">Naplánovat událost</h1>
                <p className="create-event-subtext">Vytvořte novou událost pro váš tým.</p>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form className="event-form" onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Vyberte tým</label>
                        <select
                            name="teamId"
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

                    <div className="form-group">
                        <label>Typ události</label>
                        <select
                            name="type"
                            value={formData.type as string}
                            onChange={handleChange}
                        >
                            <option value={EventType.Announcement}>Oznámení (Info)</option>
                            <option value={EventType.Match}>Zápas</option>
                            <option value={EventType.Poll}>Anketa (Trénink)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Název události</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Datum a čas</label>
                        <input
                            type="datetime-local"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Místo konání</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Popis (volitelné)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={isLoading || !formData.teamId} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                        {isLoading ? 'Ukládám...' : 'Vytvořit událost'}
                    </button>
                </div>
            </form>
        </div>
    );
}