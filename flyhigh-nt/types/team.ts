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
    role: string | number;
    isActive: boolean;
}

export interface TeamDetail {
    id: string;
    teamName: string;
    shortName: string;
    description?: string;
    myRole: string;
    members: TeamMemberDto[];
}

export interface PendingInvitationDto {
    teamId: string;
    teamName: string;
    invitingRole: string;
    invitedAt?: string | Date;
}

export interface Team {
    id: string;
    teamName: string;
    shortName: string;
    role?: string;
    status?: string;
}

export interface CreateTeamDto {
    teamName: string;
    shortName: string;
    description?: string;
}

export interface UpdateTeamDto {
    teamName: string;
    abbreviation: string;
    description: string;
}