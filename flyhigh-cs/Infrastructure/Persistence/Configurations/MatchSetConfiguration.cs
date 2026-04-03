using Domain.Entities.Matches;
using Domain.Entities.Matches.MatchEnums;
using Domain.Value_Objects.Matches;
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
    builder.HasKey(s => s.Id);
    builder.Property(s => s.Id)
        .HasConversion(id => id.Value, value => new MatchSetId(value));

    builder.Property(s => s.MatchId)
        .HasConversion(id => id.Value, value => new MatchId(value))
        .IsRequired();

    builder.Property(s => s.SetNumber).IsRequired();

    builder.Property(s => s.Type)
        .HasConversion<string>()
        .HasDefaultValue(SetType.Standard)
        .IsRequired();

    builder.Property(s => s.HomeScore).IsRequired();
    builder.Property(s => s.AwayScore).IsRequired();
    builder.Property(s => s.IsFinished).IsRequired();
    builder.Property(s => s.IsStarted).IsRequired();

    builder.Property(s => s.Winner)
        .HasConversion<string>()
        .HasDefaultValue(SetWinner.None)
        .IsRequired();

    builder.HasMany(s => s.Positions)
        .WithOne()
        .HasForeignKey(p => p.MatchSetId)
        .OnDelete(DeleteBehavior.Cascade);
  }
}