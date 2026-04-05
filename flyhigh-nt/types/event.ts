export enum EventType {
    Announcement = "Announcement",
    Poll = "Poll",
    Match = "Match"
}

export enum EventResponse {
    Unknown = "Unknown",
    Accepted = "Accepted",
    Declined = "Declined"
}

export interface EventParticipantDto {
    userId: string;
    response: EventResponse;
}

export interface EventDto {
    id: string;
    teamId: string;
    creatorId: string;
    title: string;
    description: string | null;
    type: EventType;
    eventDate: string | null;
    location: string | null;
    createdAt: string;
    participants: EventParticipantDto[];
    myResponse: EventResponse;
    acceptedCount: number;
    declinedCount: number;
}

export interface CreateEventDto {
    teamId: string;
    title: string;
    description: string | null;
    type: EventType;
    eventDate: string | null;
    location: string | null;
    invitedUserIds: string[];
}

export interface RespondToEventDto {
    response: EventResponse;
}

export interface DashboardEventItem extends EventDto {
    teamName?: string;
}
