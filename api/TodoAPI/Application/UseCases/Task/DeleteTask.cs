using TodoAPI.Application.Interfaces;
using TodoAPI.Domain.Interfaces;
using TodoAPI.Domain.Interfaces.Persistence;

namespace TodoAPI.Application.UseCases;

public class DeleteTask : IDeleteTask
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTask(ITaskRepository taskRepository, IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task ExecuteAsync(Guid id)
    {
        var task = await _taskRepository.GetTask(id);
        _taskRepository.DeleteTask(task);
        await _unitOfWork.SaveChangesAsync();
    }
}
