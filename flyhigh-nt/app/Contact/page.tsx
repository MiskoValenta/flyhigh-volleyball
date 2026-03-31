'use client';

import React from 'react';
import { useContact } from '@/hooks/Contact/useContact';
import './Contact.css';

export default function ContactPage() {
    const { formData, status, isLoading, handleChange, handleSubmit } = useContact();

    let statusMessage = null;
    if (status !== '') {
        statusMessage = <p className="status-message">{status}</p>;
    }

    let buttonText = "Odeslat zprávu";
    if (isLoading === true) {
        buttonText = "Odesílám...";
    }

    return (
        <div className="contact-container">
            <h1 className="contact-title">Kontaktujte nás</h1>

            <form onSubmit={handleSubmit} className="contact-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Vaše jméno"
                    className="form-input"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Váš e-mail"
                    className="form-input"
                    required
                />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Vaše zpráva"
                    className="form-textarea"
                    required
                />

                {statusMessage}

                <button type="submit" className="submit-button" disabled={isLoading}>
                    {buttonText}
                </button>
            </form>
        </div>
    );
}