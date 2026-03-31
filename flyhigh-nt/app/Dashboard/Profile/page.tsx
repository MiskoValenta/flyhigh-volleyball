'use client';

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/Profile/useProfile';
import './Profile.css';

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
            setStatusMessage({ type: 'success', text: 'Profil byl úspěšně aktualizován.' });
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message });
        }
    };

    const onChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleChangePassword(passwordData);
            setStatusMessage({ type: 'success', text: 'Heslo bylo změněno.' });
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message });
        }
    };

    if (isLoading) return <div className="ProfileLoading">Načítám profil...</div>;

    return (
        <div className="ProfileContainer">
            <h1 className="ProfileTitle">Nastavení Profilu</h1>

            {fetchError && <div className="ErrorMessage">{fetchError}</div>}
            {statusMessage.text && (
                <div className={`StatusBanner ${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}

            <div className="ProfileFormsWrapper">
                <form className="ProfileFormCard" onSubmit={onUpdateProfile}>
                    <h2 className="FormHeading">Základní údaje</h2>

                    <label className="FormLabel">Jméno</label>
                    <input
                        type="text"
                        className="FormInput"
                        value={profileData.firstName}
                        onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                        required
                    />

                    <label className="FormLabel">Příjmení</label>
                    <input
                        type="text"
                        className="FormInput"
                        value={profileData.lastName}
                        onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                        required
                    />

                    <button type="submit" className="SaveButton">Uložit změny</button>
                </form>

                <form className="PasswordFormCard" onSubmit={onChangePassword}>
                    <h2 className="FormHeading">Změna hesla</h2>

                    <label className="FormLabel">Staré heslo</label>
                    <input
                        type="password"
                        className="FormInput"
                        value={passwordData.oldPassword}
                        onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        required
                    />

                    <label className="FormLabel">Nové heslo</label>
                    <input
                        type="password"
                        className="FormInput"
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                    />

                    <button type="submit" className="SaveButton">Změnit heslo</button>
                </form>
            </div>
        </div>
    );
}