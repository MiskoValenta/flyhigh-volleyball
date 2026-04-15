export enum MatchStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected",
    InProgress = "InProgress",
    Finished = "Finished",
    Cancelled = "Cancelled"
}

export enum SetSide {
    Home = "Home",
    Away = "Away"
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
    Home = "Home",
    Away = "Away"
}

export interface MatchPlayerPositionDto {
    id: string;
    rosterEntryId: string;
    teamSide: SetSide;
    position: PlayerPosition;
}

export interface MatchSetDto {
    id: string;
    setNumber: number;
    setType: SetType;
    homeScore: number;
    awayScore: number;
    startTime: string;
    endTime: string | null;
    winnerSide: SetSide | null;
    positions: MatchPlayerPositionDto[];
}

export interface MatchRosterEntryDto {
    id: string;
    teamSide: SetSide;
    teamMemberId: string;
    userName: string;
    jerseyNumber: number;
}

export interface MatchDto {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeamName: string;
    awayTeamName: string;
    date: string;
    location: string | null;
    status: MatchStatus;
    creatorId: string;
    refereeId: string | null;
    rosters: MatchRosterEntryDto[];
    sets: MatchSetDto[];
}

export interface ProposeMatchDto {
    opponentTeamId: string;
    matchDate: string;
    location?: string;
    refereeId?: string;
}

export interface AddRosterEntryDto {
    teamSide: SetSide;
    teamMemberId: string;
    jerseyNumber: number;
}

export interface SetPlayerPositionDto {
    rosterEntryId: string;
    position: PlayerPosition;
}

export interface StartSetDto {
    positions: SetPlayerPositionDto[];
}

export interface RecordPointDto {
    teamSide: SetSide;
    isPenalty: boolean;
}