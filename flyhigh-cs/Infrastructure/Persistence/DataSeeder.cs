using Application.Interfaces.Users;
using Domain.Entities.Events;
using Domain.Entities.Events.EventEnums;
using Domain.Entities.Matches;
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
    public List<string> CoachEmails { get; set; } = new();
    public List<string> MemberEmails { get; set; } = new();
  }

  private class EventResponseSeedModel
  {
    public string UserEmail { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
  }

  private class EventSeedModel
  {
    public string TeamAbbreviation { get; set; } = string.Empty;
    public string CreatorEmail { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime? EventDate { get; set; }
    public List<EventResponseSeedModel> Responses { get; set; } = new();
  }

  private class MatchSeedModel
  {
    public string HomeTeamAbbreviation { get; set; } = string.Empty;
    public string AwayTeamAbbreviation { get; set; } = string.Empty;
    public string CreatorEmail { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
  }

  public static async Task SeedAsync(FlyHighDbContext context, IPasswordHasher passwordHasher)
  {
    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    string baseDir = Path.Combine(Directory.GetCurrentDirectory(), "SeedData");

    Console.WriteLine("\n--- START DATAS EEDERU ---");

    if (!await context.Users.AnyAsync())
    {
      string usersPath = Path.Combine(baseDir, "users.json");
      if (File.Exists(usersPath))
      {
        string usersJson = await File.ReadAllTextAsync(usersPath);
        var seedUsers = JsonSerializer.Deserialize<List<UserSeedModel>>(usersJson, options);

        if (seedUsers != null)
        {
          foreach (var su in seedUsers)
          {
            var hashedPassword = passwordHasher.Hash(su.Password);
            var user = User.Create(su.FirstName, su.LastName, su.Email, hashedPassword);
            await context.Users.AddAsync(user);
            Console.WriteLine($"✅ Uživatel vytvořen: {su.Email}");
          }
          await context.SaveChangesAsync();
          Console.WriteLine("✅ Všichni uživatelé úspěšně uloženi.");
        }
      }
      else
      {
        Console.WriteLine("❌ Soubor users.json nebyl nalezen!");
      }
    }
    else
    {
      Console.WriteLine("⏩ Uživatelé již existují, přeskakuji seedování uživatelů.");
    }

    if (!await context.Teams.AnyAsync())
    {
      string teamsPath = Path.Combine(baseDir, "teams.json");
      if (File.Exists(teamsPath))
      {
        string teamsJson = await File.ReadAllTextAsync(teamsPath);
        var seedTeams = JsonSerializer.Deserialize<List<TeamSeedModel>>(teamsJson, options);
        var allUsers = await context.Users.ToListAsync();

        if (seedTeams != null)
        {
          foreach (var st in seedTeams)
          {
            var owner = allUsers.FirstOrDefault(u => u.Email == st.OwnerEmail);
            if (owner == null)
            {
              Console.WriteLine($"❌ Chyba: Majitel {st.OwnerEmail} nebyl nalezen. Tým {st.Name} se nevytvoří.");
              continue;
            }

            var team = Team.Create(owner.Id, st.Name, st.Abbreviation, "Naseedovaný tým pro testování");
            Console.WriteLine($"✅ Tým vytvořen: {team.TeamName} (Majitel: {owner.Email})");

            if (st.CoachEmails != null)
            {
              foreach (var coachEmail in st.CoachEmails)
              {
                var coachUser = allUsers.FirstOrDefault(u => u.Email == coachEmail);
                if (coachUser != null)
                {
                  team.InviteMember(coachUser.Id, TeamRole.Coach);
                  team.AcceptInvitation(coachUser.Id);
                  Console.WriteLine($"   -> Přidán Trenér: {coachEmail}");
                }
                else
                {
                  Console.WriteLine($"   ⚠️ Varování: Trenér {coachEmail} nenalezen v DB.");
                }
              }
            }

            if (st.MemberEmails != null)
            {
              foreach (var memberEmail in st.MemberEmails)
              {
                var memberUser = allUsers.FirstOrDefault(u => u.Email == memberEmail);
                if (memberUser != null)
                {
                  team.InviteMember(memberUser.Id, TeamRole.Member);
                  team.AcceptInvitation(memberUser.Id);
                  Console.WriteLine($"   -> Přidán Hráč: {memberEmail}");
                }
                else
                {
                  Console.WriteLine($"   ⚠️ Varování: Hráč {memberEmail} nenalezen v DB.");
                }
              }
            }

            await context.Teams.AddAsync(team);
          }
          await context.SaveChangesAsync();
          Console.WriteLine("✅ Všechny týmy a členové úspěšně uloženi.");
        }
      }
      else
      {
        Console.WriteLine("❌ Soubor teams.json nebyl nalezen!");
      }
    }
    else
    {
      Console.WriteLine("⏩ Týmy již existují, přeskakuji seedování týmů.");
    }

    if (!await context.Events.AnyAsync())
    {
      string eventsPath = Path.Combine(baseDir, "events.json");
      if (File.Exists(eventsPath))
      {
        string eventsJson = await File.ReadAllTextAsync(eventsPath);
        var seedEvents = JsonSerializer.Deserialize<List<EventSeedModel>>(eventsJson, options);

        var allUsers = await context.Users.ToListAsync();
        var allTeams = await context.Teams.ToListAsync();

        if (seedEvents != null)
        {
          foreach (var se in seedEvents)
          {
            var team = allTeams.FirstOrDefault(t => t.ShortName == se.TeamAbbreviation);
            if (team == null)
            {
              Console.WriteLine($"❌ Událost '{se.Title}' přeskočena: Tým se zkratkou {se.TeamAbbreviation} nebyl nalezen.");
              continue;
            }

            var creatorUser = allUsers.FirstOrDefault(u => u.Email == se.CreatorEmail);

            var creatorId = team.OwnerId;
            if (creatorUser != null)
            {
              creatorId = creatorUser.Id;
            }
            else
            {
              Console.WriteLine($"   ⚠️ Tvůrce {se.CreatorEmail} nenalezen. Nastavuji tvůrce jako majitele týmu {team.ShortName}.");
            }

            if (Enum.TryParse<EventType>(se.Type, out var eventType))
            {
              var newEvent = Event.Create(
                  creatorId,
                  team.Id,
                  se.Title,
                  se.Description,
                  eventType,
                  se.EventDate,
                  se.Location
              );

              if (se.Responses != null)
              {
                foreach (var resp in se.Responses)
                {
                  var participantUser = allUsers.FirstOrDefault(u => u.Email == resp.UserEmail);
                  if (participantUser != null)
                  {
                    if (Enum.TryParse<EventResponse>(resp.Response, out var parsedResponse))
                    {
                      newEvent.Respond(participantUser.Id, parsedResponse);
                      Console.WriteLine($"   -> Hlas ({parsedResponse}) přidán pro {resp.UserEmail}");
                    }
                    else
                    {
                      Console.WriteLine($"   ⚠️ Neznámá odpověď: '{resp.Response}' u uživatele {resp.UserEmail}.");
                    }
                  }
                  else
                  {
                    Console.WriteLine($"   ⚠️ Uživatel {resp.UserEmail} pro hlasování nenalezen.");
                  }
                }
              }

              await context.Events.AddAsync(newEvent);
              Console.WriteLine($"✅ Událost vytvořena: {se.Title} (Tým: {team.ShortName})");
            }
            else
            {
              Console.WriteLine($"❌ Neplatný typ události: '{se.Type}' pro událost '{se.Title}'.");
            }
          }
          await context.SaveChangesAsync();
          Console.WriteLine("✅ Všechny události úspěšně uloženy.");
        }
      }
      else
      {
        Console.WriteLine("❌ Soubor events.json nebyl nalezen!");
      }
    }
    else
    {
      Console.WriteLine("⏩ Události již existují, přeskakuji seedování událostí.");
    }

    if (!await context.Matches.AnyAsync())
    {
      string matchesPath = Path.Combine(baseDir, "matches.json");
      if (File.Exists(matchesPath))
      {
        string matchesJson = await File.ReadAllTextAsync(matchesPath);
        var seedMatches = JsonSerializer.Deserialize<List<MatchSeedModel>>(matchesJson, options);

        var allUsers = await context.Users.ToListAsync();
        var allTeams = await context.Teams.ToListAsync();

        if (seedMatches != null)
        {
          foreach (var sm in seedMatches)
          {
            var homeTeam = allTeams.FirstOrDefault(t => t.ShortName == sm.HomeTeamAbbreviation);
            var awayTeam = allTeams.FirstOrDefault(t => t.ShortName == sm.AwayTeamAbbreviation);
            var creator = allUsers.FirstOrDefault(u => u.Email == sm.CreatorEmail);

            if (homeTeam != null && awayTeam != null)
            {
              var match = Match.Create(
                  homeTeam.Id,
                  awayTeam.Id,
                  sm.Location,
                  sm.ScheduledAt
              );

              if (string.Equals(sm.Status, "Accepted", StringComparison.OrdinalIgnoreCase))
              {
                match.AcceptMatch();
              }

              await context.Matches.AddAsync(match);
              Console.WriteLine($"✅ Zápas vytvořen: {homeTeam.ShortName} vs {awayTeam.ShortName} (Stav: {match.Status}, Datum: {sm.ScheduledAt})");
            }
            else
            {
              if (homeTeam == null) Console.WriteLine($"❌ Zápas přeskočen: Domácí tým {sm.HomeTeamAbbreviation} nebyl nalezen.");
              if (awayTeam == null) Console.WriteLine($"❌ Zápas přeskočen: Hostující tým {sm.AwayTeamAbbreviation} nebyl nalezen.");
            }
          }
          await context.SaveChangesAsync();
          Console.WriteLine("✅ Všechny zápasy úspěšně uloženy.");
        }
      }
      else
      {
        Console.WriteLine("❌ Soubor matches.json nebyl nalezen!");
      }
    }
    else
    {
      Console.WriteLine("⏩ Zápasy již existují, přeskakuji seedování zápasů.");
    }

    Console.WriteLine("--- KONEC DATA SEEDERU ---\n");
  }
}