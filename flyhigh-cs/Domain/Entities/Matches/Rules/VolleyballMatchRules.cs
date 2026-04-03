using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public class VolleyballMatchRules : IMatchRules
{
  public int SetsToWin => 3;
}
