'use client';

import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/Profile/useProfile";
import "./Profile.css";

export default function ProfilePage() {
    const { user, isLoading, error: fetchError, handleUpdateProfile, handleChangePassword } = useProfile();

    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
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
            setStatusMessage({ type: 'success-alert-profile', text: 'Heslo bylo změněno.' });
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (err: any) {
            setStatusMessage({ type: 'error-alert-profile', text: err.message });
        }
    };

    if (isLoading) return <div className="profile-container">Načítám profil...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card glass-card-addition glass-card">
                <h1 className="profile-title dashboard-heading">Základní údaje</h1>

                {fetchError && <div className="error-alert-profile">{fetchError}</div>}
                {statusMessage.text && (
                    <div className={statusMessage.type}>
                        {statusMessage.text}
                    </div>
                )}

                <form className="profile-form" onSubmit={onUpdateProfile}>
                    <div className="form-row-profile">
                        <div className="form-group-profile">
                            <label>Jméno</label>
                            <input
                                type="text"
                                className="auth-input-profile"
                                value={profileData.firstName}
                                onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group-profile">
                            <label>Příjmení</label>
                            <input
                                type="text"
                                className="auth-input-profile"
                                value={profileData.lastName}
                                onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="profile-btn-container">
                        <button type="submit" className="btn-primary">Uložit změny</button>
                    </div>
                </form>
            </div>

            <div className="profile-card profile-settings-card glass-card">
                <h2 className="profile-title dashboard-heading">Změna hesla</h2>
                <form className="profile-form" onSubmit={onChangePassword}>
                    <div className="form-group-profile">
                        <label>Staré heslo</label>
                        <input
                            type="password"
                            className="auth-input-profile"
                            value={passwordData.oldPassword}
                            onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group-profile">
                        <label>Nové heslo</label>
                        <input
                            type="password"
                            className="auth-input-profile"
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="profile-btn-container">
                        <button type="submit" className="btn-primary">Změnit heslo</button>
                    </div>
                </form>
            </div>
        </div>
    );
}