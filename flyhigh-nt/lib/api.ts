import { fetchWithAuth } from './apiClient';
import { UserProfile } from '@/types/user';

export const loginUser = async (credentials: any) => {
    const res = await fetchWithAuth(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Chyba při přihlášení. Zkontrolujte údaje.');
    }
    return res.json().catch(() => ({}));
};

export const registerUser = async (userData: any) => {
    const res = await fetchWithAuth(`/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registrace selhala. Tento email už pravděpodobně někdo využívá.');
    }
    return res.json().catch(() => ({}));
};

export const logoutUser = async () => {
    const res = await fetchWithAuth(`/auth/logout`, {
        method: 'POST'
    });

    if (!res.ok) {
        throw new Error('Nepodařilo se odhlásit ze serveru.');
    }
};

export const getCurrentUser = async (): Promise<UserProfile> => {
    const res = await fetchWithAuth(`/auth/me`);
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst profil uživatele.');
    }
    return res.json();
};

export const forgotPassword = async (email: string): Promise<void> => {
    const res = await fetchWithAuth(`/auth/forgot-password`, {
        method: 'POST',
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se odeslat žádost o obnovu hesla.');
    }
};

export const updateProfile = async (data: { firstName: string; lastName: string; email: string }): Promise<void> => {
    const res = await fetchWithAuth(`/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se aktualizovat profil.');
    }
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }): Promise<void> => {
    const res = await fetchWithAuth(`/users/password`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se změnit heslo.');
    }
};

export const isManagerRole = (role: any): boolean => {
    if (role === null || role === undefined) return false;
    const r = role.toString().toLowerCase();
    return r === 'owner' || r === '0' || r === 'coach' || r === '1';
};

export const getUserStats = async (): Promise<{ matchesPlayed: number; MatchesPlayed?: number }> => {
    const res = await fetchWithAuth(`/users/stats`);
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst statistiky uživatele.');
    }
    return res.json();
};