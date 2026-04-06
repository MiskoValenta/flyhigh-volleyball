import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { LoginCredentials } from '@/types/user';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            await loginUser(credentials);
            router.push('/Dashboard');
            return true;
        } catch (err: any) {
            setError(err.message || "Špatné přihlašovací údaje.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error, setError };
};