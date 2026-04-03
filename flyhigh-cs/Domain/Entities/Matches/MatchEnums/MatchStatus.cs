using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.MatchEnums;

public enum MatchStatus
{
  Pending,
  Accepted,
  Rejected,
  InProgress,
  Finished,
  Cancelled
}
