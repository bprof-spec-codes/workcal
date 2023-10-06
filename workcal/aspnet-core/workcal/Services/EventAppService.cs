using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using workcal.Entities;
using workcal.Services.Dtos;
using Volo.Abp.Domain.Repositories;

namespace workcal.Services
{
    public class EventAppService : ApplicationService, IEventAppService
    {
        private readonly IRepository<Event, Guid> _eventRepository;

        public EventAppService(IRepository<Event, Guid> eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task CreateAsync(CreateEventDto input)
        {
            var eventEntity = new Event
            {
                Name = input.Name,
                StartTime = input.StartTime,
                EndTime = input.EndTime,
                Location = input.Location,
                Labels = input.Labels.Select(label => new Label
                {
                    Name = label.Name,
                    Color = label.Color
                }).ToList()
            };

            await _eventRepository.InsertAsync(eventEntity);
        }

        public async Task<EventDto> GetAsync(Guid id)
        {
            var eventEntity = await _eventRepository.GetAsync(id);
            return ObjectMapper.Map<Event, EventDto>(eventEntity);
        }

        // Implementation for getting all events
        public async Task<List<EventDto>> GetAllAsync()
        {
            var events = await _eventRepository.GetListAsync();
            return ObjectMapper.Map<List<Event>, List<EventDto>>(events);
        }

        // Implementation for deleting an event by id
        public async Task DeleteAsync(Guid id)
        {
            await _eventRepository.DeleteAsync(id);
        }

        // Implementation for updating an event
        public async Task UpdateAsync(Guid id, CreateEventDto input)
        {
            var eventEntity = await _eventRepository.GetAsync(id);  // Retrieve the existing event
            eventEntity.Name = input.Name;  // Update fields
            eventEntity.StartTime = input.StartTime;
            eventEntity.EndTime = input.EndTime;
            eventEntity.Location = input.Location;

            await _eventRepository.UpdateAsync(eventEntity);  // Update the event in the repository
        }
    }

}
