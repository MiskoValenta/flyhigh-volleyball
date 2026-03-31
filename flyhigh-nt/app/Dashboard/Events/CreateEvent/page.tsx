'use client';

import React from 'react';
import { useCreateEvent } from '@/hooks/Events/useCreateEvent';
import './CreateEvent.css';

export default function CreateEventPage() {
    const { formData, error, isLoading, handleChange, handleSubmit } = useCreateEvent();

    let errorMessage = null;
    if (error !== '') {
        errorMessage = <p className="error-message">{error}</p>;
    }

    let buttonText = "Vytvořit událost";
    if (isLoading === true) {
        buttonText = "Vytvářím...";
    }

    return (
        <div className="create-event-container">
            <h1 className="create-event-title">Nová událost</h1>

            <form onSubmit={handleSubmit} className="create-event-form">
                <input
                    type="text"
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleChange}
                    placeholder="ID Týmu"
                    className="form-input"
                    required
                />
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Název události"
                    className="form-input"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Popis (volitelné)"
                    className="form-textarea"
                />
                <input
                    type="datetime-local"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Místo konání"
                    className="form-input"
                    required
                />

                {errorMessage}

                <button type="submit" className="submit-button" disabled={isLoading}>
                    {buttonText}
                </button>
            </form>
        </div>
    );
}