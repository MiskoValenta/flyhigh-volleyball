import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';

export function useLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await loginUser({ email, password });
            router.push('/Dashboard');
        } catch (err: any) {
            setError(err.message || 'Chyba při přihlášení.');
        } finally {
            setIsLoading(false);
        }
    };

    return { email, setEmail, password, setPassword, error, isLoading, handleSubmit };
}