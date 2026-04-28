namespace TodoAPI.Application.Interfaces;

using TodoAPI.Application.DTOs;

public interface IUpdateTask
{
    Task<TaskResponse> ExecuteAsync(TaskEditRequest request);
}