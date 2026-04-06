'use client';

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/Profile/useProfile';
import { ThemeToggle } from '@/app/theme-toggle';
import './Profile.css';

export default function ProfilePage() {
    const { user, isLoading, error: fetchError, handleUpdateProfile, handleChangePassword } = useProfile();

    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });

    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user !== null) {
            setProfileData({ firstName: user.firstName, lastName: user.lastName, email: user.email });
        }
    }, [user]);

    const onUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleUpdateProfile(profileData);
            setStatusMessage({ type: 'success-alert-profile', text: 'Profil byl úspěšně aktualizován.' });
        } catch (err: any) {
            setStatusMessage({ type: 'error-alert-profile', text: err.message });
        }
    };

    const onChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleChangePassword(passwordData);
            setStatusMessage({ type: 'success-alert-profile', text: 'Heslo bylo úspěšně změněno.' });
            setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err: any) {
            setStatusMessage({ type: 'error-alert-profile', text: err.message });
        }
    };

    if (isLoading) {
        return <div className="profile-container">Načítám profil...</div>;
    }

    let errorDisplay = null;
    if (fetchError !== "") {
        errorDisplay = <div className="error-alert-profile global-alert">{fetchError}</div>;
    }

    let statusDisplay = null;
    if (statusMessage.text !== "") {
        statusDisplay = <div className={`${statusMessage.type} global-alert`}>{statusMessage.text}</div>;
    }

    return (
        <div className="profile-container">
            {errorDisplay}
            {statusDisplay}

            <div className="profile-card glass-card-dark">
                <h1 className="dashboard-heading">Základní údaje</h1>

                <form className="profile-form" onSubmit={onUpdateProfile}>
                    <div className="form-row-cp">
                        <div className="form-group-cp">
                            <label>Jméno</label>
                            <input
                                type="text"
                                className="auth-input-cp"
                                value={profileData.firstName}
                                onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group-cp">
                            <label>Příjmení</label>
                            <input
                                type="text"
                                className="auth-input-cp"
                                value={profileData.lastName}
                                onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="profile-btn-container">
                        <button type="submit" className="button-primary">Uložit změny</button>
                    </div>
                </form>
            </div>

            <div className="profile-card profile-settings-card glass-card-dark">
                <h2 className="dashboard-heading">Změna hesla</h2>
                <form className="profile-form" onSubmit={onChangePassword}>
                    <div className="form-group-cp">
                        <label>Staré heslo</label>
                        <input
                            type="password"
                            className="auth-input-cp"
                            value={passwordData.oldPassword}
                            onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group-cp">
                        <label>Nové heslo</label>
                        <input
                            type="password"
                            className="auth-input-cp"
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group-cp">
                        <label>Potvrdit nové heslo</label>
                        <input
                            type="password"
                            className="auth-input-cp"
                            value={passwordData.confirmNewPassword}
                            onChange={e => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="profile-btn-container">
                        <button type="submit" className="button-primary">Změnit heslo</button>
                    </div>
                </form>
            </div>

            <div className="profile-card glass-card-dark">
                <h2 className="dashboard-heading">Vzhled aplikace</h2>
                <div className="theme-settings-row">
                    <div className="theme-settings-text">
                        <h3>Motiv aplikace</h3>
                        <p>Přepínejte mezi světlým a tmavým režimem podle vašich preferencí.</p>
                    </div>
                    <div className="theme-settings-action">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

        </div>
    );
}