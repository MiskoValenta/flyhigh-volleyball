using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Security;

public static class ClaimsPrincipalExtensions
{
  public static Guid GetUserId(this ClaimsPrincipal user)
  {
    var userIdString = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (userIdString == null)
    {
      userIdString = user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
      if (userIdString == null)
      {
        userIdString = user.FindFirst("sub")?.Value;
      }
    }

    if (string.IsNullOrEmpty(userIdString))
    {
      throw new UnauthorizedAccessException("Uživatel není autorizován nebo token neobsahuje ID.");
    }

    return Guid.Parse(userIdString);
  }
}