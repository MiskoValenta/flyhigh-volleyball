using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public static class VolleyballMatchRules
{
  public static bool IsMatchFinished(int homeSetsWon, int awaySetsWon)
  {
    int setsToWin = 3;

    return homeSetsWon >= setsToWin || awaySetsWon >= setsToWin;
  }
}
