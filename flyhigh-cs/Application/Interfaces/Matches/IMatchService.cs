using Application.DTOs.Matches;
using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Matches;

public interface IMatchService
{
  Task<MatchDto> CreateMatchAsync(Guid userId, CreateMatchRequest request);
  Task AcceptMatchAsync(Guid userId, Guid matchId);
  Task RejectMatchAsync(Guid userId, Guid matchId);
  Task CancelMatchAsync(Guid userId, Guid matchId);

  Task AddRefereeAsync(Guid userId, Guid matchId, Guid refereeId);
  Task AddToRosterAsync(Guid userId, Guid matchId, AddToRosterRequest request);

  Task StartNextSetAsync(Guid userId, Guid matchId, StartSetRequest request);
  Task RecordPointAsync(Guid userId, Guid matchId, RecordPointRequest request);

  Task<MatchDto?> GetByIdAsync(Guid matchId);
  Task<List<MatchDto>> GetTeamMatchesAsync(Guid teamId);
}
