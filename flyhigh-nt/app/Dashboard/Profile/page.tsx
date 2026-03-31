'use client';

import React from 'react';
import { useProfile } from '@/hooks/Profile/useProfile';
import './Profile.css';

export default function ProfilePage() {
    const { formData, error, success, isLoading, handleChange, handleSubmit } = useProfile();

    let errorMessage = null;
    if (error !== '') {
        errorMessage = <p className="error-message">{error}</p>;
    }

    let successMessage = null;
    if (success !== '') {
        successMessage = <p className="success-message">{success}</p>;
    }

    let buttonText = "Uložit změny";
    if (isLoading === true) {
        buttonText = "Ukládám...";
    }

    return (
        <div className="profile-container">
            <h1 className="profile-title">Můj profil</h1>

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Jméno</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Příjmení</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                {errorMessage}
                {successMessage}

                <button type="submit" className="submit-button" disabled={isLoading}>
                    {buttonText}
                </button>
            </form>
        </div>
    );
}