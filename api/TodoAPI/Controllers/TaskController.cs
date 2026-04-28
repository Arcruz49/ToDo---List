using Microsoft.AspNetCore.Mvc;
using TodoAPI.Application.DTOs;
using TodoAPI.Application.Interfaces;

namespace TodoAPI.Controllers;

[ApiController]
[Route("tasks")]
public class TaskController : ControllerBase
{
    private readonly ICreateTask _createTask;
    private readonly IUpdateTask _updateTask;
    private readonly IGetTask _getTask;
    private readonly IGetTasks _getTasks;
    private readonly IDeleteTask _deleteTask;

    public TaskController(
        ICreateTask createTask,
        IUpdateTask updateTask,
        IGetTask getTask,
        IGetTasks getTasks,
        IDeleteTask deleteTask)
    {
        _createTask = createTask;
        _updateTask = updateTask;
        _getTask = getTask;
        _getTasks = getTasks;
        _deleteTask = deleteTask;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] TaskCreateRequest request)
    {
        if (string.IsNullOrEmpty(request.Title?.Trim())) return BadRequest("Title is required");

        var response = await _createTask.ExecuteAsync(request);

        return Created($"/tasks/{response.Id}", response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTask([FromBody] TaskEditRequest request)
    {
        if (string.IsNullOrEmpty(request.Title?.Trim())) return BadRequest("Title is required");

        var response = await _updateTask.ExecuteAsync(request);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(Guid id)
    {
        var response = await _getTask.ExecuteAsync(id);

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var response = await _getTasks.ExecuteAsync();

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        await _deleteTask.ExecuteAsync(id);

        return NoContent();
    }
}