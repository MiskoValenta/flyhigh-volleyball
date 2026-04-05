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
    response: EventResponse | string;
}

export interface EventDto {
    id: string;
    teamId: string;
    creatorId: string;
    title: string;
    description: string | null;
    type: EventType | string;
    eventDate: string | null;
    location: string | null;
    createdAt: string;
    participants: EventParticipantDto[];
    myResponse: EventResponse | string;
    acceptedCount: number;
    declinedCount: number;
}

export interface CreateEventDto {
    teamId: string;
    title: string;
    description: string | null;
    type: EventType | string;
    eventDate: string | null;
    location: string | null;
    invitedUserIds: string[];
}

export interface RespondToEventDto {
    response: EventResponse | string;
}