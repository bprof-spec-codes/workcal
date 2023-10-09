using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using workcal.Entities;
using workcal.Services.Dtos;
using Volo.Abp.Domain.Repositories;
using Microsoft.IdentityModel.Tokens;
using AutoMapper.Internal.Mappers;
using Microsoft.EntityFrameworkCore;  


namespace workcal.Services
{
    public class EventAppService : ApplicationService, IEventAppService
    {
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Label, Guid> _labelRepository;

        public EventAppService(IRepository<Event, Guid> eventRepository, IRepository<Label, Guid> labelRepository)
        {
            _eventRepository = eventRepository;
            _labelRepository = labelRepository;
        }

        public async Task CreateAsync(CreateEventDto input)
        {
            // Create and Save Event
            var eventEntity = new Event
            {
                Name = input.Name,
                StartTime = input.StartTime,
                EndTime = input.EndTime,
                Location = input.Location,
            };
            await _eventRepository.InsertAsync(eventEntity);

            // Now that the event is created and has an ID, we can create labels
            if (input.Labels != null && input.Labels.Count > 0)
            {
                foreach (var label in input.Labels)
                {
                    var labelEntity = new Label
                    {
                        EventId = eventEntity.Id, // Assign the newly created Event's ID
                        Name = label.Name,
                        Color = label.Color
                    };
                    await _labelRepository.InsertAsync(labelEntity); // Assuming _labelRepository is your label repository
                }
            }
        }

        public async Task<EventDto> GetAsync(Guid id)
        {
            var eventEntity = await _eventRepository.WithDetails(e => e.Labels).FirstOrDefaultAsync(i => i.Id == id);
            ;
            return ObjectMapper.Map<Event, EventDto>(eventEntity);
        }

        // Implementation for getting all events
        public async Task<List<EventDto>> GetAllAsync()
        {
            var events = await _eventRepository
                .WithDetails(e => e.Labels)  // Include Labels in the query.
                .ToListAsync();

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
            var eventEntity = await _eventRepository.WithDetails(e => e.Labels).FirstOrDefaultAsync(i => i.Id == id);
            // Retrieve the existing event

            // Update fields
            eventEntity.Name = input.Name;
            eventEntity.StartTime = input.StartTime;
            eventEntity.EndTime = input.EndTime;
            eventEntity.Location = input.Location;

            // Assume you have a way to fetch existing labels for the event.
            var existingLabels = eventEntity.Labels;

            // Find labels to be added
            var labelsToAdd = input.Labels.Where(il => !existingLabels.Any(el => el.Name == il.Name)).ToList();
            foreach (var label in labelsToAdd)
            {
                existingLabels.Add(new Label
                {
                    Name = label.Name,
                    Color = label.Color,
                    EventId = id
                });
            }

            // Find labels to be deleted
            var labelsToDelete = existingLabels.Where(el => !input.Labels.Any(il => il.Name == el.Name)).ToList();
            foreach (var label in labelsToDelete)
            {
                existingLabels.Remove(label);
            }

            eventEntity.Labels = existingLabels;

            await _eventRepository.UpdateAsync(eventEntity);  // Update the event in the repository
        }

    }

}
