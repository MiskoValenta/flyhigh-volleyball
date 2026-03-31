import { useState } from 'react';
import { registerUser } from '@/lib/apiClient';

export function useRegister() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await registerUser(formData);
            setSuccess('Registrace proběhla úspěšně. Nyní se můžete přihlásit.');
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Chyba při registraci.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, error, success, isLoading, handleChange, handleSubmit };
}