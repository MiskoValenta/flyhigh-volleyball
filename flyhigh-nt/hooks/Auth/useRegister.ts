import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { RegisterCredentials } from '@/types/user';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        setError(null);

        if (credentials.password !== credentials.confirmPassword) {
            setError("Hesla se neshodují.");
            setIsLoading(false);
            return false;
        }

        try {
            const { confirmPassword, ...dataToSend } = credentials;
            await registerUser(dataToSend);

            router.push('/Dashboard');
            return true;
        } catch (err: any) {
            setError(err.message || "Registrace selhala. Zkuste to prosím znovu.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error, setError };
};