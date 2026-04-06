using Application.Interfaces.Users;
using Domain.Entities.Teams;
using Domain.Entities.Teams.TeamEnums;
using Domain.Entities.Users;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

public static class DataSeeder
{
  private class UserSeedModel
  {
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
  }

  private class TeamSeedModel
  {
    public string Name { get; set; } = string.Empty;
    public string Abbreviation { get; set; } = string.Empty;
    public string OwnerEmail { get; set; } = string.Empty;
    public List<string> MemberEmails { get; set; } = new();
  }

  public static async Task SeedAsync(FlyHighDbContext context, IPasswordHasher passwordHasher)
  {
    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

    if (!await context.Users.AnyAsync())
    {
      var usersPath = Path.Combine(Directory.GetCurrentDirectory(), "SeedData", "users.json");

      if (File.Exists(usersPath))
      {
        var usersJson = await File.ReadAllTextAsync(usersPath);
        var seedUsers = JsonSerializer.Deserialize<List<UserSeedModel>>(usersJson, options);

        if (seedUsers != null && seedUsers.Any())
        {
          foreach (var seedUser in seedUsers)
          {
            var hashedPassword = passwordHasher.Hash(seedUser.Password);
            var user = User.Create(seedUser.FirstName, seedUser.LastName, seedUser.Email, hashedPassword);
            await context.Users.AddAsync(user);
          }

          await context.SaveChangesAsync();
          Console.WriteLine("✅ Data uživatelů byla úspěšně nahrána!");
        }
      }
      else
      {
        Console.WriteLine($"⚠️ VAROVÁNÍ: Soubor s uživateli nebyl nalezen na cestě: {usersPath}");
      }
    }

    if (!await context.Teams.AnyAsync())
    {
      var teamsPath = Path.Combine(Directory.GetCurrentDirectory(), "SeedData", "teams.json");

      if (File.Exists(teamsPath))
      {
        var teamsJson = await File.ReadAllTextAsync(teamsPath);
        var seedTeams = JsonSerializer.Deserialize<List<TeamSeedModel>>(teamsJson, options);

        if (seedTeams != null && seedTeams.Any())
        {

          var allUsers = await context.Users.ToListAsync();

          foreach (var seedTeam in seedTeams)
          {
            var owner = allUsers.FirstOrDefault(u => u.Email == seedTeam.OwnerEmail);

            if (owner == null)
            {
              Console.WriteLine($"❌ Chyba: Majitel {seedTeam.OwnerEmail} nebyl nalezen pro tým {seedTeam.Name}.");
              continue;
            }

            var team = Team.Create(owner.Id, seedTeam.Name, seedTeam.Abbreviation, "Naseedovaný tým pro testování");

            var zakladatel = team.Members.FirstOrDefault();
            Console.WriteLine($"\n--- DIAGNOSTIKA ---");
            Console.WriteLine($"Tým: {team.TeamName}");
            Console.WriteLine($"Majitel: {owner.Email} má roli: {zakladatel?.Role}");
            Console.WriteLine($"-------------------\n");

            foreach (var memberEmail in seedTeam.MemberEmails)
            {
              var user = allUsers.FirstOrDefault(u => u.Email == memberEmail);

              if (user != null)
              {
                team.InviteMember(user.Id, TeamRole.Member);

                team.AcceptInvitation(user.Id);
              }
              else
              {
                Console.WriteLine($"⚠️ VAROVÁNÍ: Hráč {memberEmail} nebyl nalezen v DB a nebyl přidán do týmu.");
              }
            }

            await context.Teams.AddAsync(team);
          }

          await context.SaveChangesAsync();
          Console.WriteLine("✅ Data týmů a jejich členů byla úspěšně nahrána!");
        }
      }
      else
      {
        Console.WriteLine($"⚠️ VAROVÁNÍ: Soubor s týmy nebyl nalezen na cestě: {teamsPath}");
      }
    }
  }
}