using Domain.Common;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Users;

public class User : AuditableEntity<UserId>
{
  public string FirstName { get; private set; }
  public string LastName { get; private set; }
  public string Email { get; private set; }
  public string PasswordHash { get; private set; }
  public string? RefreshToken { get; private set; }
  public DateTime? RefreshTokenExpiryTime { get; private set; }

  private User() { }

  private User(
    UserId id,
    string firstName,
    string lastName,
    string email,
    string passwordHash) : base(id)
  {
    FirstName = firstName;
    LastName = lastName;
    Email = email;
    PasswordHash = passwordHash;
  }

  public static User Create(
    string firstName,
    string lastName,
    string email,
    string passwordHash)
  {
    var newId = UserId.New();

    string normalizedEmail;
    if (string.IsNullOrWhiteSpace(email))
    {
      normalizedEmail = string.Empty;
    }
    else
    {
      normalizedEmail = email.Trim().ToLower();
    }

    string normalizedFirstName;
    if (string.IsNullOrWhiteSpace(firstName))
    {
      normalizedFirstName = string.Empty;
    }
    else
    {
      normalizedFirstName = firstName.Trim();
    }

    string normalizedLastName;
    if (string.IsNullOrWhiteSpace(lastName))
    {
      normalizedLastName = string.Empty;
    }
    else
    {
      normalizedLastName = lastName.Trim();
    }

    return new User(
      newId,
      normalizedFirstName,
      normalizedLastName,
      normalizedEmail,
      passwordHash);
  }

  public void UpdateRefreshToken(string token, DateTime expiryTime)
  {
    RefreshToken = token;
    RefreshTokenExpiryTime = expiryTime;
  }

  public void UpdatePassword(string newPassword)
  {
    PasswordHash = newPassword;
    MarkAsModified();
  }

  public void UpdateProfile(string firstName, string lastName, string email)
  {
    if (string.IsNullOrWhiteSpace(firstName))
    {
      FirstName = string.Empty;
    }
    else
    {
      FirstName = firstName.Trim();
    }

    if (string.IsNullOrWhiteSpace(lastName))
    {
      LastName = string.Empty;
    }
    else
    {
      LastName = lastName.Trim();
    }

    if (string.IsNullOrWhiteSpace(email))
    {
      Email = string.Empty;
    }
    else
    {
      Email = email.Trim().ToLower();
    }
  }
}