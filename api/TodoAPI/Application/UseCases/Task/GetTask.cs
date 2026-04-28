using TodoAPI.Application.Interfaces;
using TodoAPI.Application.DTOs;
using TodoAPI.Domain.Enums;
using TodoAPI.Domain.Interfaces;
using TodoAPI.Domain.Entities;

namespace TodoAPI.Application.UseCases;

public class GetTask : IGetTask{

    private readonly ITaskRepository _taskRepository;
    public GetTask(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<TaskResponse> ExecuteAsync(Guid id)
    {
        var task = await _taskRepository.GetTask(id);

            return new TaskResponse(
            task.Id,
            task.Title,
            task.Description ?? "",
            task.CreatedAt,
            task.ConcludedAt,
            task.Status,
            task.Color ?? ""
        );
    }
}
