using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public class VolleyballSetRules : ISetRules
{
  public int PointsToWinStandardSet => 25;
  public int PointsToWinTieBreak => 15;
  public int PointDifferenceRequired => 2;
}
