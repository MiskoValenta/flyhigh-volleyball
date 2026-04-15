export enum MatchStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    InProgress = "InProgress",
    Finished = "Finished",
    Cancelled = "Cancelled"
}

export enum PlayerPosition {
    Bench = "Bench",
    Setter = "Setter",
    OutsideHitter = "OutsideHitter",
    MiddleBlocker = "MiddleBlocker",
    Opposite = "Opposite",
    Libero = "Libero"
}

export interface MatchRosterDto {
    userId: string;
    teamId: string;
    jerseyNumber: number;
}

export interface MatchPlayerPositionDto {
    userId: string;
    teamId: string;
    position: PlayerPosition;
}

export interface MatchSetDto {
    id: string;
    setNumber: number;
    homeTeamScore: number;
    awayTeamScore: number;
    isCompleted: boolean;
    winnerTeamId?: string | null;
    playerPositions: MatchPlayerPositionDto[];
}

export interface MatchDto {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    refereeId?: string | null;
    location: string;
    scheduledDate: string;
    status: MatchStatus;
    homeSetsWon: number;
    awaySetsWon: number;
    roster: MatchRosterDto[];
    sets: MatchSetDto[];
}

export interface CreateMatchRequest {
    homeTeamId: string;
    awayTeamId: string;
    location: string;
    scheduledDate: string;
}

export interface AddToRosterRequest {
    userId: string;
    jerseyNumber: number;
}

export interface PlayerPositionSetup {
    userId: string;
    teamId: string;
    position: PlayerPosition;
}

export interface StartSetRequest {
    playerPositions: PlayerPositionSetup[];
}

export interface RecordPointRequest {
    scoringTeamId: string;
}