import { useState } from 'react';
import { forgotPassword } from '../../lib/api';
import { ForgotPasswordRequest } from '../../types/user';

export const useForgotPassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const requestPasswordReset = async (data: ForgotPasswordRequest) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            await forgotPassword(data.email);
            setIsSuccess(true);
            return true;
        } catch (err: any) {
            setError(err.message || "Nepodařilo se odeslat žádost o obnovu hesla.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { requestPasswordReset, isLoading, error, setError, isSuccess };
};