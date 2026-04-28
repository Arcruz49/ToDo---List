namespace TodoAPI.Application.Interfaces;

using TodoAPI.Application.DTOs;

public interface IGetTask
{
    Task <TaskResponse> ExecuteAsync(Guid id);
}