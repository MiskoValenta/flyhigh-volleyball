'use client';

import React from 'react';
import { useCreateTeam } from '@/hooks/Teams/useCreateTeam';
import { Button } from '@/components/ui/button';

export default function CreateTeamPage() {
    const { formData, error, isLoading, handleChange, handleSubmit } = useCreateTeam();

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Vytvořit nový tým</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Název týmu"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleChange}
                    placeholder="Zkratka"
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Popis týmu"
                    className="w-full p-2 border rounded"
                />

                {error && <p className="text-red-500">{error}</p>}

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Vytvářím...' : 'Vytvořit tým'}
                </Button>
            </form>
        </div>
    );
}