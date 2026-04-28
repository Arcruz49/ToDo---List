using TodoAPI.Application.Interfaces;
using TodoAPI.Application.DTOs;
using TodoAPI.Domain.Enums;
using TodoAPI.Domain.Interfaces;
using TodoAPI.Domain.Interfaces.Persistence;
using TodoAPI.Domain.Entities;

namespace TodoAPI.Application.UseCases;

public class CreateTask : ICreateTask{

    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateTask(IUnitOfWork unitOfWork, ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TaskResponse> ExecuteAsync(TaskCreateRequest request)
    {

        var task = new TodoTask()
        {
            Title = request.Title ?? "",
            Description = request.Description ?? "",
            CreatedAt = DateTime.UtcNow,
            Color = request.Color ?? "",
        };

        _taskRepository.CreateTask(task);
        await _unitOfWork.SaveChangesAsync();

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
