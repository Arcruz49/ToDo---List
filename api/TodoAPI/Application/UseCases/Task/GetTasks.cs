using TodoAPI.Application.Interfaces;
using TodoAPI.Application.DTOs;
using TodoAPI.Domain.Enums;
using TodoAPI.Domain.Interfaces;
using TodoAPI.Domain.Entities;

namespace TodoAPI.Application.UseCases;

public class GetTasks : IGetTasks{

    private readonly ITaskRepository _taskRepository;
    public GetTasks(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<List<TaskResponse>> ExecuteAsync()
    {
        var tasks = await _taskRepository.GetTasks();

        return tasks.Select(task => new TaskResponse(
            task.Id,
            task.Title,
            task.Description ?? "",
            task.CreatedAt,
            task.ConcludedAt,
            task.Status,
            task.Color ?? "",
            task.DueDate
        )).ToList();
    }
}
