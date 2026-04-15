using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.Matches;

public record MatchDto(
    Guid Id,
    Guid HomeTeamId,
    Guid AwayTeamId,
    Guid? RefereeId,
    string Location,
    DateTime ScheduledDate,
    string Status,
    int HomeSetsWon,
    int AwaySetsWon,
    List<MatchRosterDto> Roster,
    List<MatchSetDto> Sets
);

public record MatchRosterDto(
    Guid UserId,
    Guid TeamId,
    int JerseyNumber
);

public record MatchSetDto(
    Guid Id,
    int SetNumber,
    int HomeTeamScore,
    int AwayTeamScore,
    bool IsCompleted,
    Guid? WinnerTeamId,
    List<MatchPlayerPositionDto> PlayerPositions
);

public record MatchPlayerPositionDto(
    Guid UserId,
    Guid TeamId,
    string Position
);

public record CreateMatchRequest(
    Guid HomeTeamId,
    Guid AwayTeamId,
    string Location,
    DateTime ScheduledDate
);

public record AddToRosterRequest(
    Guid UserId,
    int JerseyNumber
);

public record StartSetRequest(
    List<PlayerPositionSetup> PlayerPositions
);

public record PlayerPositionSetup(
    Guid UserId,
    Guid TeamId,
    string Position
);

public record RecordPointRequest(
    Guid ScoringTeamId
);