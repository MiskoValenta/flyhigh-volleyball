"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMatchDetail } from "@/hooks/Matches/useMatchDetail";
import { getTeamById } from "@/lib/teamApi";
import { TeamDetail } from "@/types/team";
import "./MatchDetail.css";

export default function MatchDetailPage() {
    const params = useParams();
    const matchId = params.matchId as string;

    const { match, isLoading, error, handleAddPlayer, handleSetReferee, fetchMatch } = useMatchDetail(matchId);

    const [homeTeamInfo, setHomeTeamInfo] = useState<TeamDetail | null>(null);
    const [awayTeamInfo, setAwayTeamInfo] = useState<TeamDetail | null>(null);

    const [homePlayerInput, setHomePlayerInput] = useState("");
    const [homeJerseyInput, setHomeJerseyInput] = useState("");

    const [awayPlayerInput, setAwayPlayerInput] = useState("");
    const [awayJerseyInput, setAwayJerseyInput] = useState("");

    const [refereeInput, setRefereeInput] = useState("");

    useEffect(() => {
        const loadTeamsInfo = async () => {
            if (match) {
                try {
                    const hTeam = await getTeamById(match.homeTeamId);
                    setHomeTeamInfo(hTeam);
                } catch (e) {
                }

                try {
                    const aTeam = await getTeamById(match.awayTeamId);
                    setAwayTeamInfo(aTeam);
                } catch (e) {
                }
            }
        };
        loadTeamsInfo();
    }, [match]);

    if (isLoading) {
        return <div className="detail-msg-md">Načítám detaily...</div>;
    }

    if (error !== "") {
        return <div className="detail-msg-md error-md">{error}</div>;
    }

    if (!match) {
        return <div className="detail-msg-md">Zápas neexistuje.</div>;
    }

    const submitHomePlayer = async (e: React.FormEvent) => {
        e.preventDefault();

        const jerseyNum = parseInt(homeJerseyInput);
        let isTaken = false;

        if (match.homeRoster) {
            for (let i = 0; i < match.homeRoster.length; i++) {
                if (match.homeRoster[i].jerseyNumber === jerseyNum) {
                    isTaken = true;
                }
            }
        }

        if (isTaken) {
            alert("Toto číslo dresu je v domácím týmu již zabrané.");
        } else {
            try {
                await handleAddPlayer({ teamId: match.homeTeamId, playerId: homePlayerInput, jerseyNumber: jerseyNum });
                setHomePlayerInput("");
                setHomeJerseyInput("");
            } catch (err) {
                alert("Nepodařilo se přidat hráče.");
            }
        }
    };

    const submitAwayPlayer = async (e: React.FormEvent) => {
        e.preventDefault();

        const jerseyNum = parseInt(awayJerseyInput);
        let isTaken = false;

        if (match.awayRoster) {
            for (let i = 0; i < match.awayRoster.length; i++) {
                if (match.awayRoster[i].jerseyNumber === jerseyNum) {
                    isTaken = true;
                }
            }
        }

        if (isTaken) {
            alert("Toto číslo dresu je v hostujícím týmu již zabrané.");
        } else {
            try {
                await handleAddPlayer({ teamId: match.awayTeamId, playerId: awayPlayerInput, jerseyNumber: jerseyNum });
                setAwayPlayerInput("");
                setAwayJerseyInput("");
            } catch (err) {
                alert("Nepodařilo se přidat hráče.");
            }
        }
    };

    const submitReferee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleSetReferee(refereeInput);
            alert("Rozhodčí byl úspěšně nastaven.");
            setRefereeInput("");
        } catch (err) {
            alert("Nepodařilo se nastavit rozhodčího.");
        }
    };

    let homeOptions = [];
    homeOptions.push(<option key="def" value="">Vyberte hráče...</option>);
    if (homeTeamInfo) {
        if (homeTeamInfo.members) {
            for (let i = 0; i < homeTeamInfo.members.length; i++) {
                const member = homeTeamInfo.members[i];
                homeOptions.push(<option key={member.userId} value={member.userId}>{member.firstName} {member.lastName}</option>);
            }
        }
    }

    let awayOptions = [];
    awayOptions.push(<option key="def" value="">Vyberte hráče...</option>);
    if (awayTeamInfo) {
        if (awayTeamInfo.members) {
            for (let i = 0; i < awayTeamInfo.members.length; i++) {
                const member = awayTeamInfo.members[i];
                awayOptions.push(<option key={member.userId} value={member.userId}>{member.firstName} {member.lastName}</option>);
            }
        }
    }

    let homeRosterList = [];
    if (match.homeRoster) {
        for (let i = 0; i < match.homeRoster.length; i++) {
            const player = match.homeRoster[i];
            homeRosterList.push(
                <div key={player.id} className="roster-item-md">
                    <span className="jersey-md">#{player.jerseyNumber}</span>
                    <span className="player-name-md">{player.playerId}</span>
                </div>
            );
        }
    }

    let awayRosterList = [];
    if (match.awayRoster) {
        for (let i = 0; i < match.awayRoster.length; i++) {
            const player = match.awayRoster[i];
            awayRosterList.push(
                <div key={player.id} className="roster-item-md">
                    <span className="jersey-md">#{player.jerseyNumber}</span>
                    <span className="player-name-md">{player.playerId}</span>
                </div>
            );
        }
    }

    let refereeSection = null;
    if (match.status === "Accepted") {
        let currentReferee = "Nenastaven";
        if (match.refereeId) {
            currentReferee = match.refereeId;
        }

        refereeSection = (
            <div className="referee-box-md glass-card-dark">
                <h3>Správa rozhodčího</h3>
                <p>Aktuální rozhodčí: {currentReferee}</p>
                <form onSubmit={submitReferee} className="ref-form-md">
                    <input
                        type="text"
                        value={refereeInput}
                        onChange={(e) => setRefereeInput(e.target.value)}
                        placeholder="Zadejte ID nového rozhodčího"
                        className="input-md"
                        required
                    />
                    <button type="submit" className="btn-save-md">Uložit</button>
                </form>
            </div>
        );
    }

    let engineButton = null;
    if (match.status === "Accepted") {
        engineButton = (
            <Link href={`/Dashboard/Matches/${match.id}/Live`} className="btn-live-md">
                Otevřít LIVE Engine
            </Link>
        );
    } else {
        if (match.status === "InProgress") {
            engineButton = (
                <Link href={`/Dashboard/Matches/${match.id}/Live`} className="btn-live-md">
                    Otevřít LIVE Engine
                </Link>
            );
        }
    }

    let homeTeamDisplay = match.homeTeamId;
    if (homeTeamInfo) {
        homeTeamDisplay = homeTeamInfo.teamName;
    }

    let awayTeamDisplay = match.awayTeamId;
    if (awayTeamInfo) {
        awayTeamDisplay = awayTeamInfo.teamName;
    }

    let homeRosterContent = null;
    if (homeRosterList.length > 0) {
        homeRosterContent = homeRosterList;
    } else {
        homeRosterContent = <p className="empty-md">Žádní hráči</p>;
    }

    let awayRosterContent = null;
    if (awayRosterList.length > 0) {
        awayRosterContent = awayRosterList;
    } else {
        awayRosterContent = <p className="empty-md">Žádní hráči</p>;
    }

    let matchStatusLower = match.status.toLowerCase();

    return (
        <div className="page-wrapper-md">
            <div className="header-md">
                <h1>Detail Zápasu</h1>
                <span className={`status-badge-md status-${matchStatusLower}`}>{match.status}</span>
            </div>

            <div className="top-actions-md">
                <Link href="/Dashboard/Matches" className="btn-back-md">Zpět</Link>
                {engineButton}
            </div>

            {refereeSection}

            <div className="rosters-grid-md">
                <div className="roster-col-md glass-card-dark">
                    <h2>Domácí ({homeTeamDisplay})</h2>
                    <div className="roster-list-md">
                        {homeRosterContent}
                    </div>

                    <form onSubmit={submitHomePlayer} className="add-form-md">
                        <select value={homePlayerInput} onChange={(e) => setHomePlayerInput(e.target.value)} className="input-md" required>
                            {homeOptions}
                        </select>
                        <input
                            type="number"
                            value={homeJerseyInput}
                            onChange={(e) => setHomeJerseyInput(e.target.value)}
                            placeholder="Dres"
                            className="input-md num-md"
                            required
                        />
                        <button type="submit" className="btn-add-md">Přidat</button>
                    </form>
                </div>

                <div className="roster-col-md glass-card-dark">
                    <h2>Hosté ({awayTeamDisplay})</h2>
                    <div className="roster-list-md">
                        {awayRosterContent}
                    </div>

                    <form onSubmit={submitAwayPlayer} className="add-form-md">
                        <select value={awayPlayerInput} onChange={(e) => setAwayPlayerInput(e.target.value)} className="input-md" required>
                            {awayOptions}
                        </select>
                        <input
                            type="number"
                            value={awayJerseyInput}
                            onChange={(e) => setAwayJerseyInput(e.target.value)}
                            placeholder="Dres"
                            className="input-md num-md"
                            required
                        />
                        <button type="submit" className="btn-add-md">Přidat</button>
                    </form>
                </div>
            </div>
        </div>
    );
}