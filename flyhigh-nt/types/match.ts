export enum SetSide {
    Home = "Home",
    Away = "Away"
}

export enum PlayerPosition {
    Setter = "Setter",
    OutsideHitter = "OutsideHitter",
    Opposite = "Opposite",
    MiddleBlocker = "MiddleBlocker",
    Libero = "Libero",
    DefensiveSpecialist = "DefensiveSpecialist"
}

export interface CreateMatchDto {
    homeTeamId: string;
    awayTeamId: string;
    location: string;
    scheduledAt: string;
    refereeId?: string | null;
}

export interface AssignPositionDto {
    setNumber: number;
    teamMemberId: string;
    position: PlayerPosition | number;
}

export interface RosterPlayerDto {
    teamMemberId: string;
    teamId: string;
    jerseyNumber: number;
}

export interface CancelMatchDto {
    reason: string;
}

export interface ProposeMatchResponse {
    matchId: string;
}

export interface MatchSetDto {
    setNumber: number;
    type: string;
    homeScore: number;
    awayScore: number;
    isFinished: boolean;
    isStarted: boolean;
    winner?: string | null;
}

export interface MatchResponseDto {
    id: string;
    homeTeamId: string;
    homeTeamName: string;
    awayTeamId: string;
    awayTeamName: string;
    location: string;
    scheduledAt: string;
    status: string;
}

export interface Match {
    id: string;
    creatorId: string;
    homeTeamId: string;
    homeTeamName: string;
    awayTeamId: string;
    awayTeamName: string;
    location: string;
    scheduledAt: string;
    status: string;
    roster: RosterPlayerDto[];
    sets: MatchSetDto[];
    winnerId?: string | null;
}