import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventApi } from '@/lib/eventApi';

export function useCreateEvent() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        teamId: '',
        title: '',
        description: '',
        type: 0,
        eventDate: '',
        location: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await eventApi.createEvent(formData);
            router.push('/Dashboard');
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

    return { formData, error, isLoading, handleChange, handleSubmit };
}