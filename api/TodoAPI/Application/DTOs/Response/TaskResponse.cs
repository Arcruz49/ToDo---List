using TodoAPI.Domain.Enums;

namespace TodoAPI.Application.DTOs;

public record TaskResponse(
    Guid Id,
    string Title,
    string Description,
    DateTime CreatedAt,
    DateTime? ConcludedAt,
    TodoTaskStatus Status,
    string Color
);
