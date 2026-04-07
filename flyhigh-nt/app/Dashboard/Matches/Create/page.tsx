"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateMatch } from "@/hooks/Matches/useCreateMatch";
import { getMyTeams } from "@/lib/teamApi";
import { TeamResponseDto } from "@/types/team";
import "./CreateMatch.css";

export default function CreateMatchPage() {
    const router = useRouter();
    const { createNewMatch, isCreating, createError } = useCreateMatch();
    const [myTeams, setMyTeams] = useState<TeamResponseDto[]>([]);

    const [homeTeamId, setHomeTeamId] = useState("");
    const [awayTeamId, setAwayTeamId] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [refereeId, setRefereeId] = useState("");

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teams = await getMyTeams();
                let activeTeams = [];
                for (let i = 0; i < teams.length; i++) {
                    if (teams[i].status === "Active") {
                        activeTeams.push(teams[i]);
                    }
                }
                setMyTeams(activeTeams);
            } catch (err) {
                console.log("Nepodařilo se načíst týmy.");
            }
        };
        fetchTeams();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            homeTeamId: homeTeamId,
            awayTeamId: awayTeamId,
            scheduledDate: date,
            location: location,
            refereeId: refereeId
        };

        const result = await createNewMatch(payload);
        if (result) {
            alert("Výzva k zápasu byla úspěšně odeslána.");
            router.push("/Dashboard/Matches");
        }
    };

    let teamOptions = [];
    teamOptions.push(<option key="default" value="">Vyberte váš tým...</option>);
    for (let i = 0; i < myTeams.length; i++) {
        teamOptions.push(
            <option key={myTeams[i].id} value={myTeams[i].id}>
                {myTeams[i].teamName}
            </option>
        );
    }

    let errorBox = null;
    if (createError !== "") {
        errorBox = <div className="error-box-cm">{createError}</div>;
    }

    return (
        <div className="page-wrapper-cm">
            <div className="header-row-cm">
                <h1 className="dashboard-heading">Vytvořit výzvu k zápasu</h1>
                <Link href="/Dashboard/Matches" className="btn-cancel-cm">Zrušit</Link>
            </div>

            <form onSubmit={handleSubmit} className="form-card-cm glass-card-dark">
                {errorBox}

                <div className="form-group-cm">
                    <label className="form-label-cm">Můj Tým (Domácí)</label>
                    <select
                        value={homeTeamId}
                        onChange={(e) => setHomeTeamId(e.target.value)}
                        className="form-input-cm"
                        required
                    >
                        {teamOptions}
                    </select>
                </div>

                <div className="form-group-cm">
                    <label className="form-label-cm">ID Týmu Soupeře (Hosté)</label>
                    <input
                        type="text"
                        value={awayTeamId}
                        onChange={(e) => setAwayTeamId(e.target.value)}
                        className="form-input-cm"
                        placeholder="Zadejte přesné ID soupeře"
                        required
                    />
                </div>

                <div className="form-group-cm">
                    <label className="form-label-cm">Datum konání</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-input-cm"
                        required
                    />
                </div>

                <div className="form-group-cm">
                    <label className="form-label-cm">Místo (Volitelné)</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="form-input-cm"
                        placeholder="Kde se bude hrát?"
                    />
                </div>

                <div className="form-group-cm">
                    <label className="form-label-cm">Rozhodčí - ID Uživatele (Volitelné)</label>
                    <input
                        type="text"
                        value={refereeId}
                        onChange={(e) => setRefereeId(e.target.value)}
                        className="form-input-cm"
                        placeholder="Lze přidat i později..."
                    />
                </div>

                <button type="submit" className="btn-submit-cm" disabled={isCreating}>
                    {isCreating ? "Odesílám..." : "Odeslat výzvu"}
                </button>
            </form>
        </div>
    );
}