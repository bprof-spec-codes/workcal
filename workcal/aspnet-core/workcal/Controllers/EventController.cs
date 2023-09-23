using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Domain.Repositories;
using workcal.Data.Repositories;
using workcal.Entities;
using Microsoft.AspNetCore.Http;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using workcal.Data.DTO;
using workcal.Data.DTO.workcal.Dtos.workcal.Dtos;
using workcal.Data.DTO.workcal.Dtos;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace workcal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Controller for handling calendar events
    [Route("api/events")]
    public class EventsController : ControllerBase
    {
        private  IEventRepository _eventRepository;

        public EventsController(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public IEventRepository eventRepository { get => _eventRepository; set => _eventRepository = value; }



        // GET: api/events
        [HttpGet]
        public async Task<IEnumerable<Event>> GetEvents()
        {
            // Fetch all events
            return await _eventRepository.GetAllEventsAsync();
        }

        // GET: api/events/{id}
        [HttpGet("{id}")]
        public async Task<Event> GetEventById(Guid id)
        {
            // Fetch event by ID
            return await _eventRepository.GetEventByIdAsync(id);
        }

        // POST: api/events
        [HttpPost]
        public async Task CreateEvent(CreateEventDto input)
        {
            var newEvent = new Event
            {
                Name = input.Name,
                StartTime = input.StartTime,
                EndTime = input.EndTime,
                Location = input.Location,
             //   AssignedWorkerIds = input.AssignedWorkerIds,
                // ... set other properties from input
            };
            await _eventRepository.AddEventAsync(newEvent);
        }

        // PUT: api/events/{id}
        [HttpPut("{id}")]
        public async Task UpdateEvent(Guid id, UpdateEventDto input)
        {
            var eventToUpdate = await _eventRepository.GetEventByIdAsync(id);
            if (eventToUpdate != null)
            {
                eventToUpdate.Name = input.Name;
                eventToUpdate.StartTime = input.StartTime;
                eventToUpdate.EndTime = input.EndTime;
                eventToUpdate.Location = input.Location;
             //   eventToUpdate.AssignedWorkerIds = input.AssignedWorkerIds;
                // ... update other properties from input

                await _eventRepository.UpdateEventAsync(eventToUpdate);
            }
        }

        // DELETE: api/events/{id}
        [HttpDelete("{id}")]
        public async Task DeleteEvent(Guid id)
        {
            // Delete event
            await _eventRepository.DeleteEventAsync(id);
        }
    }

}
