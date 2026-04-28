namespace TodoAPI.Application.Interfaces;

using TodoAPI.Application.DTOs;

public interface ICreateTask
{
    Task<TaskResponse> ExecuteAsync(TaskCreateRequest request);
}