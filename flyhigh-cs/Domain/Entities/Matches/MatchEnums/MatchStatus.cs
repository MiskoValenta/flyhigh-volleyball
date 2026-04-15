using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.MatchEnums;

public enum MatchStatus
{
  Pending = 0,
  Accepted = 1,
  InProgress = 2,
  Finished = 3,
  Cancelled = 4
}
