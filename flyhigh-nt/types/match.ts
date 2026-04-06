export enum MatchStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected",
    InProgress = "InProgress",
    Finished = "Finished",
    Cancelled = "Cancelled"
}

export enum PlayerPosition {
    Setter = "Setter",
    OppositeHitter = "OppositeHitter",
    Blocker = "Blocker",
    OutsideHitter = "OutsideHitter",
    Libero = "Libero",
    Bench = "Bench"
}

export enum SetSide {
    Home = "Home",
    Away = "Away"
}

export enum SetType {
    Standard = "Standard",
    TieBreak = "TieBreak"
}

export enum SetWinner {
    None = "None",
    Home = "Home",
    Away = "Away"
}

export interface RosterPlayerDto {
    teamMemberId: string;
    teamId: string;
    jerseyNumber: number;
}

export interface MatchPlayerPositionDto {
    teamMemberId: string;
    position: PlayerPosition;
}

export interface MatchSetDto {
    setNumber: number;
    type: SetType;
    homeScore: number;
    awayScore: number;
    isFinished: boolean;
    isStarted: boolean;
    winner: SetWinner;
    positions: MatchPlayerPositionDto[];
}

export interface MatchDetail {
    id: string;
    creatorId: string;
    homeTeamId: string;
    homeTeamName: string;
    awayTeamId: string;
    awayTeamName: string;
    location: string;
    scheduledAt: string;
    status: MatchStatus;
    roster: RosterPlayerDto[];
    sets: MatchSetDto[];
    winnerId: string | null;
    refereeId: string | null;
}

export interface MatchResponseDto {
    id: string;
    homeTeamId: string;
    homeTeamName: string;
    awayTeamId: string;
    awayTeamName: string;
    location: string;
    scheduledAt: string;
    status: MatchStatus;
}

export interface CreateMatchDto {
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: string;
    location: string;
    refereeId: string | null;
}

export interface AssignPositionDto {
    setNumber: number;
    teamMemberId: string;
    position: PlayerPosition;
}

export interface CancelMatchDto {
    reason: string;
}