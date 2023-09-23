using Microsoft.EntityFrameworkCore;
using workcal.Entities;

namespace workcal.Data.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly workcalDbContext _context;

        public EventRepository(workcalDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task<Event> GetEventByIdAsync(Guid id)
        {
            return await _context.Events.FindAsync(id);
        }

        public async Task AddEventAsync(Event eventEntity)
        {
            await _context.Events.AddAsync(eventEntity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEventAsync(Event eventEntity)
        {
            _context.Events.Update(eventEntity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEventAsync(Guid id)
        {
            var eventEntity = await _context.Events.FindAsync(id);
            if (eventEntity != null)
            {
                _context.Events.Remove(eventEntity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
