import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { proposeMatch } from '@/lib/matchApi';

export function useCreateMatch() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        homeTeamId: '',
        awayTeamId: '',
        scheduledAt: '',
        location: '',
        refereeId: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await proposeMatch(formData);
            router.push('/Dashboard/Matches');
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