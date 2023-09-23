using workcal.Entities;

namespace workcal.Data.Repositories
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event> GetEventByIdAsync(Guid id);
        Task AddEventAsync(Event eventEntity);
        Task UpdateEventAsync(Event eventEntity);
        Task DeleteEventAsync(Guid id);
        // Add additional methods specific to Event
    }
}
