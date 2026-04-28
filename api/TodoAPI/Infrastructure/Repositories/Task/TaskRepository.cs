using Microsoft.EntityFrameworkCore;
using TodoAPI.Infrastructure.Data;
using TodoAPI.Domain.Entities;
using TodoAPI.Domain.Interfaces;

namespace TodoAPI.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository{

    private readonly Context _db;
    public TaskRepository(Context db)
    {
        _db = db;
    }

    public async Task <List<TodoTask>> GetTasks()
    {
        return await _db.Tasks.ToListAsync();
    }
    public async Task <TodoTask> GetTask(Guid id)
    {
        return await _db.Tasks.Where(a => a.Id == id).FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Task not found");
    }
    public TodoTask UpdateTask(TodoTask task)
    {
        _db.Tasks.Update(task);
        return task;
    }
    public TodoTask CreateTask(TodoTask task)
    {
        _db.Tasks.Add(task);
        return task;
    }

    public void DeleteTask(TodoTask task)
    {
        _db.Tasks.Remove(task);
    }
}
