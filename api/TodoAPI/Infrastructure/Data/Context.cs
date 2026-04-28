using Microsoft.EntityFrameworkCore;
using TodoAPI.Domain.Entities;

namespace TodoAPI.Infrastructure.Data;

public class Context : DbContext
{
    public Context(DbContextOptions<Context> options) : base(options) { }

    public DbSet<TodoTask> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TodoTask>(entity =>
        {
            entity.ToTable("tasks");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title").IsRequired();
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.ConcludedAt).HasColumnName("concluded_at");
            entity.Property(e => e.Color).HasColumnName("color");
            entity.Property(e => e.Status).HasColumnName("status").HasConversion<string>();
        });
    }
}