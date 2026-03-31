import { useState } from 'react';

export function useContact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStatus('Zpráva byla úspěšně odeslána.');
            setFormData({ name: '', email: '', message: '' });
        } catch (err: any) {
            setStatus('Došlo k chybě při odesílání zprávy.');
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, status, isLoading, handleChange, handleSubmit };
}