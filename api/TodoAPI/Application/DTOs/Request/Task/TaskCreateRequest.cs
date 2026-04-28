namespace TodoAPI.Application.DTOs;

public class TaskCreateRequest
{
    public string? Title {get; set; } = string.Empty;
    public string? Description {get; set; } = string.Empty;
    public string? Color {get; set; } = string.Empty;
}