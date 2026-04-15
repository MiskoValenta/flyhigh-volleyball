using Domain.Entities.Matches;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

public class MatchSetConfiguration : IEntityTypeConfiguration<MatchSet>
{
  public void Configure(EntityTypeBuilder<MatchSet> builder)
  {
    builder.ToTable("MatchSets");

    builder.HasKey(s => s.Id);

    builder.Property(s => s.Id)
           .HasConversion(id => id.Value, 
           value => new MatchSetId(value));

    builder.Property(s => s.MatchId)
           .HasConversion(id => id.Value, 
           value => new MatchId(value));

    builder.Property(s => s.WinnerTeamId)
           .HasConversion(id => id!.Value, 
           value => new TeamId(value))
           .IsRequired(false);

    builder.HasMany(s => s.PlayerPositions)
           .WithOne()
           .HasForeignKey(p => p.MatchSetId)
           .OnDelete(DeleteBehavior.Cascade);

    builder.Metadata.FindNavigation(nameof(MatchSet.PlayerPositions))!
           .SetPropertyAccessMode(PropertyAccessMode.Field);
  }
}
