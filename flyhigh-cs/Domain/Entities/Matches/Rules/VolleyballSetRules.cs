using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public static class VolleyballSetRules
{
  public static bool IsSetFinished(int homeScore, int awayScore, int setNumber)
  {
    int pointsDiff = 2;
    int maxSets = 5;
    int tieBrakeSet = 15;
    int standardSet = 25;

    int pointsToWin = (setNumber == maxSets) ? tieBrakeSet : standardSet;

    bool homeWins = homeScore >= pointsToWin && (homeScore - awayScore) >= pointsDiff;
    bool awayWins = awayScore >= pointsToWin && (awayScore - homeScore) >= pointsDiff;

    return homeWins || awayWins;
  }
}
