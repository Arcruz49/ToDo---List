namespace TodoAPI.Domain.Interfaces;
using TodoAPI.Domain.Entities;

public interface ITaskRepository
{
    Task <List<TodoTask>> GetTasks();
    Task <TodoTask> GetTask(Guid id);
    TodoTask UpdateTask(TodoTask task);
    TodoTask CreateTask(TodoTask task);
    void DeleteTask(TodoTask task);
}