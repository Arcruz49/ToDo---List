using TodoAPI.Domain.Enums;

namespace TodoAPI.Application.DTOs;

public class TaskEditRequest
{
    public Guid Id {get; set; }
    public string? Title {get; set; } = string.Empty;
    public string? Description {get; set; } = string.Empty;
    public string? Color {get; set; } = string.Empty;
    public TodoTaskStatus Status {get; set; }
}