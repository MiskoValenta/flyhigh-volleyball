import { useState } from "react";
import { ContactFormData } from '@/types/contact';

export function useContact() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const submitContactForm = async (data: ContactFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    access_key: '7a348403-af04-4860-a948-669f75508abc',
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    subject: 'Nová zpráva z webu FlyHigh Volleyball'
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
            } else {
                setError('Odeslání selhalo, zkuste to prosím znovu.');
            }
        } catch (err) {
            setError('Došlo k chybě při komunikaci se serverem.');
        } finally {
            setIsLoading(false);
        }
    };

    return { submitContactForm, isLoading, error, success };
}