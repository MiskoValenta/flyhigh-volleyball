'use client';

import React, { useState } from 'react';
import './Contact.css';

export default function ContactPage() {
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setResult("");

        const formData = new FormData(event.currentTarget);
        formData.append("access_key", "7a348403-af04-4860-a948-669f75508abc");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult("Zpráva byla úspěšně odeslána! Děkujeme.");
                (event.target as HTMLFormElement).reset();
            } else {
                setResult("Při odesílání došlo k chybě. Zkuste to prosím znovu.");
            }
        } catch (error) {
            setResult("Došlo k chybě připojení k serveru.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ContactContainer">
            <div className="ContactFormCard">
                <h1 className="ContactHeading">Kontaktujte nás</h1>
                <p className="ContactSubText">
                    Máte dotaz, návrh na zlepšení nebo potřebujete s něčím poradit? Napište nám!
                </p>

                <form className="ContactForm" onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Vaše jméno"
                        className="FormInput"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Váš e-mail"
                        className="FormInput"
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Vaše zpráva"
                        className="FormTextarea"
                        rows={6}
                        required
                    ></textarea>

                    <button type="submit" className="ContactButton" disabled={isLoading}>
                        {isLoading ? 'Odesílám...' : 'Odeslat zprávu'}
                    </button>

                    {result && <p className="ContactSubText" style={{ marginTop: '1rem' }}>{result}</p>}
                </form>
            </div>

            <div className="ContactInfoCard">
                <div className="ContactInfoItem">
                    <div className="ContactIconBox">📍</div>
                    <div className="ContactInfoText">
                        <span className="Label">Lokace</span>
                        <span className="Value">Česká republika</span>
                    </div>
                </div>
                <div className="ContactInfoItem">
                    <div className="ContactIconBox">✉️</div>
                    <div className="ContactInfoText">
                        <span className="Label">Podpora</span>
                        <a href="mailto:info@flyhigh-volleyball.cz" className="Value">
                            info@flyhigh-volleyball.cz
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}