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
                // Id = GuidGenerator.Create(),

                Name = input.Name,
                StartTime = input.StartTime,
                EndTime = input.EndTime,
                Location = input.Location
            };

            await _eventRepository.InsertAsync(eventEntity);
        }

        public async Task<EventDto> GetAsync(Guid id)
        {
            var eventEntity = await _eventRepository.GetAsync(id);
            return ObjectMapper.Map<Event, EventDto>(eventEntity);
        }
    }
}
