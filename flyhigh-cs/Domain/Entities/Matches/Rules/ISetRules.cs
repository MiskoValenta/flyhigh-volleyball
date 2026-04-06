using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public interface ISetRules
{
  int PointsToWinStandardSet { get; }
  int PointsToWinTieBreak { get; }
  int PointDifferenceRequired { get; }
}