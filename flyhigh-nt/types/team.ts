export enum TeamRole {
    Owner = "Owner",
    Coach = "Coach",
    Member = "Member"
}

export enum TeamMemberStatus {
    Pending = "Pending",
    Active = "Active",
    Declined = "Declined"
}

export interface TeamResponseDto {
    id: string;
    teamName: string;
    shortName: string;
    role: TeamRole | string;
    status: TeamMemberStatus | string;
}

export interface TeamMemberDto {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: TeamRole | string;
    isActive: boolean;
}

export interface TeamDetail {
    id: string;
    teamName: string;
    shortName: string;
    description: string | null;
    myRole: TeamRole | string;
    members: TeamMemberDto[];
}

export interface PendingInvitationDto {
    teamId: string;
    teamName: string;
    role: TeamRole | string;
    createdAt: string;
}

export interface Team {
    id: string;
    teamName: string;
    shortName: string;
    role: TeamRole | string;
    status: TeamMemberStatus | string;
}

export interface CreateTeamDto {
    teamName: string;
    shortName: string;
    description: string;
}

export interface UpdateTeamDto {
    teamName: string;
    abbreviation: string;
    description: string;
}