namespace TodoAPI.Application.Interfaces;

public interface IDeleteTask
{
    Task ExecuteAsync(Guid id);
}
