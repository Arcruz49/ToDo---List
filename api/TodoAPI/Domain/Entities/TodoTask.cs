using TodoAPI.Domain.Enums;

namespace TodoAPI.Domain.Entities;
public class TodoTask
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ConcludedAt { get; set; }
    public TodoTaskStatus Status { get; set; } = TodoTaskStatus.Pending;
    public string? Color { get; set; } = string.Empty;
}