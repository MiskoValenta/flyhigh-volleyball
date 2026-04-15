"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateMatch } from '@/hooks/Matches/useCreateMatch';
import { useTeamList } from '@/hooks/Teams/useTeamList';
import './CreateMatch.css';

export default function CreateMatchPage() {
    const router = useRouter();
    const { createMatch, loading, error } = useCreateMatch();
    const { teams, isLoading: teamsLoading } = useTeamList();

    const [homeTeamId, setHomeTeamId] = useState('');
    const [awayTeamId, setAwayTeamId] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (!homeTeamId || !awayTeamId || !location || !date || !time) {
            setValidationError('Prosím vyplňte všechna pole.');
            return;
        }
        if (homeTeamId === awayTeamId) {
            setValidationError('Domácí a hostující tým nesmí být stejný.');
            return;
        }

        const scheduledDate = new Date(`${date}T${time}:00`).toISOString();

        const success = await createMatch({
            homeTeamId,
            awayTeamId,
            location,
            scheduledDate
        });

        if (success) {
            router.push('/Dashboard/Matches');
        }
    };

    return (
        <div className="container-cm">
            <div className="form-card-cm">
                <h1 className="title-cm">Navrhnout zápas</h1>

                {(error || validationError) && (
                    <div className="error-msg-cm">
                        {validationError || error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group-cm">
                        <label className="label-cm" htmlFor="homeTeamId">Váš Tým (Domácí)</label>
                        <select
                            id="homeTeamId"
                            className="select-cm"
                            value={homeTeamId}
                            onChange={(e) => setHomeTeamId(e.target.value)}
                            disabled={teamsLoading}
                        >
                            <option value="">-- Vyberte váš tým --</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.teamName} ({team.shortName})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-cm">
                        <label className="label-cm" htmlFor="awayTeamId">ID Soupeře (Hosté)</label>
                        <input
                            id="awayTeamId"
                            type="text"
                            className="input-cm"
                            placeholder="Zadejte ID soupeřova týmu"
                            value={awayTeamId}
                            onChange={(e) => setAwayTeamId(e.target.value)}
                        />
                    </div>

                    <div className="form-group-cm">
                        <label className="label-cm" htmlFor="location">Místo konání</label>
                        <input
                            id="location"
                            type="text"
                            className="input-cm"
                            placeholder="Např. Hala ZŠ Boženy Němcové"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="date-time-row-cm">
                        <div className="form-group-cm">
                            <label className="label-cm" htmlFor="date">Datum</label>
                            <input
                                id="date"
                                type="date"
                                className="input-cm"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group-cm">
                            <label className="label-cm" htmlFor="time">Čas</label>
                            <input
                                id="time"
                                type="time"
                                className="input-cm"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn-cm"
                        disabled={loading || teamsLoading}
                    >
                        {loading ? 'Odesílám pozvánku...' : 'Navrhnout zápas'}
                    </button>
                </form>

                <Link href="/Dashboard/Matches" className="back-link-cm">
                    ← Zrušit a vrátit se zpět
                </Link>
            </div>
        </div>
    );
}