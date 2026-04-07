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
    Opposite = "Opposite",
    MiddleBlocker = "MiddleBlocker",
    OutsideHitter = "OutsideHitter",
    Libero = "Libero",
    Bench = "Bench"
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

export enum SetSide {
    Home = "Home",
    Away = "Away"
}

export interface RosterPlayerDto {
    teamId: string;
    playerId: string;
    jerseyNumber: number;
};

export interface AssignPositionDto {
    playerId: string;
    position: PlayerPosition;
    side: SetSide;
};

export interface MatchDto {
    id: string;
    creatorId: string;
    receiverId: string;
    homeTeamId: string;
    awayTeamId: string;
    status: MatchStatus;
    homeSetsWon: number;
    awaySetsWon: number;
    scheduledDate: string | null;
    location: string | null;
    refereeId: string | null;
    createdAt: string;
    sets: MatchSetDto[];
    homeRoster: MatchRosterEntryDto[];
    awayRoster: MatchRosterEntryDto[];
}

export interface MatchSetDto {
    id: string;
    matchId: string;
    setNumber: number;
    setType: SetType;
    homeScore: number;
    awayScore: number;
    isFinished: boolean;
    winner: SetWinner;
    playerPositions: MatchPlayerPositionDto[];
}

export interface MatchRosterEntryDto {
    id: string;
    matchId: string;
    teamId: string;
    playerId: string;
    jerseyNumber: number;
    playerName: string;
}

export interface MatchPlayerPositionDto {
    id: string;
    matchSetId: string;
    playerId: string;
    position: PlayerPosition;
    side: SetSide;
    playerName: string;
}

export interface CreateMatchDto {
    homeTeamId: string;
    awayTeamId: string;
    scheduledDate: string | null;
    location: string | null;
    refereeId: string | null;
}

export interface MatchEnhanced extends MatchDto {
    homeTeamName: string;
    homeTeamAbbr: string;
    awayTeamName: string;
    awayTeamAbbr: string;
    creatorName: string;
}