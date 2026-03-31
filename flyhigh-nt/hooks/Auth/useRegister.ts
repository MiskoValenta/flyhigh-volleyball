import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';

export function useRegister() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await registerUser({ firstName, lastName, email, password });
            router.push('/Dashboard');
        } catch (err: any) {
            setError(err.message || 'Chyba při registraci.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        firstName, setFirstName,
        lastName, setLastName,
        email, setEmail,
        password, setPassword,
        error, isLoading, handleSubmit
    };
}