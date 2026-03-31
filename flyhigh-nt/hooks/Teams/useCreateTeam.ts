import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTeam } from '@/lib/teamApi';

export function useCreateTeam() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        teamName: '',
        shortName: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await createTeam(formData);
            router.push('/Dashboard/Teams');
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