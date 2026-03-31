import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, updateProfile, changePassword } from '@/lib/api';
import { UserProfile } from '@/types/user';

export function useProfile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getCurrentUser();
            setUser(data);
        } catch (err: any) {
            setError(err.message || 'Nepodařilo se načíst profil.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleUpdateProfile = async (data: { firstName: string; lastName: string; email: string }) => {
        try {
            await updateProfile(data);
            await fetchUser();
            return true;
        } catch (err: any) {
            throw new Error(err.message || 'Nepodařilo se aktualizovat profil.');
        }
    };

    const handleChangePassword = async (data: { oldPassword: string; newPassword: string }) => {
        try {
            await changePassword(data);
            return true;
        } catch (err: any) {
            throw new Error(err.message || 'Nepodařilo se změnit heslo. Zkontrolujte původní heslo.');
        }
    };

    return {
        user,
        isLoading,
        error,
        refreshProfile: fetchUser,
        handleUpdateProfile,
        handleChangePassword
    };
}