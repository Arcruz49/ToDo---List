namespace TodoAPI.Application.Interfaces;

using TodoAPI.Application.DTOs;

public interface IGetTasks
{
    Task <List<TaskResponse>> ExecuteAsync();
}