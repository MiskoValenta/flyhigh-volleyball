using Application.Common.Interfaces;
using Domain.Entities.Events;
using Domain.Entities.Matches;
using Domain.Entities.Teams;
using Domain.Entities.Users;
using Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Infrastructure.Persistence;

public class FlyHighDbContext : DbContext, IUnitOfWork
{
  public FlyHighDbContext(DbContextOptions<FlyHighDbContext> options) : base(options) { }

  public DbSet<User> Users { get; set; } = null!;
  public DbSet<Team> Teams { get; set; } = null!;
  public DbSet<TeamMember> TeamMembers { get; set; } = null!;
  public DbSet<Event> Events { get; set; } = null!;
  public DbSet<EventParticipant> EventParticipants { get; set; } = null!;
  public DbSet<Match> Matches { get; set; } = null!;
  public DbSet<MatchSet> MatchSets { get; set; } = null!;
  public DbSet<MatchRosterEntry> MatchRosterEntries { get; set; } = null!;
  public DbSet<MatchPlayerPosition> MatchPlayerPositions { get; set; } = null!;


  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    base.OnModelCreating(modelBuilder);
  }
}
