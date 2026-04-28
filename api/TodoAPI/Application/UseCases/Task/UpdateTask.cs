using TodoAPI.Application.Interfaces;
using TodoAPI.Application.DTOs;
using TodoAPI.Domain.Enums;
using TodoAPI.Domain.Interfaces;
using TodoAPI.Domain.Interfaces.Persistence;
using TodoAPI.Domain.Entities;

namespace TodoAPI.Application.UseCases;

public class UpdateTask : IUpdateTask{

    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTask(IUnitOfWork unitOfWork, ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TaskResponse> ExecuteAsync(TaskEditRequest request)
    {

        var task = await _taskRepository.GetTask(request.Id);

        task.Title = request.Title ?? "";
        task.Description = request.Description ?? "";
        task.Status = request.Status;
        task.Color = request.Color ?? "";

        if (request.Status == TodoTaskStatus.Completed && task.ConcludedAt is null)
            task.ConcludedAt = DateTime.UtcNow;

        _taskRepository.UpdateTask(task);
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
