import { useState } from 'react';
import { updateProfile } from '@/lib/apiClient';

export function useProfile() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
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
            await updateProfile(formData);
            setSuccess('Profil byl úspěšně upraven.');
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Došlo k chybě při komunikaci se serverem.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, setFormData, error, success, isLoading, handleChange, handleSubmit };
}