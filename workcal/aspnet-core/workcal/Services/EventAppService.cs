﻿using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using workcal.Entities;
using workcal.Services.Dtos;
using Volo.Abp.Domain.Repositories;
using Microsoft.IdentityModel.Tokens;
using AutoMapper.Internal.Mappers;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Polly;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.Users;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Authorization;
using Volo.Abp.Identity;
using static Volo.Abp.Identity.Settings.IdentitySettingNames;

namespace workcal.Services
{
    public class EventAppService : ApplicationService, IEventAppService
    {
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Label, Guid> _labelRepository;
        private readonly IRepository<EventsUsers, Guid> _eventsUsersRepository;
        private readonly IRepository<Volo.Abp.Identity.IdentityUser, Guid> _userRepository; // Inject the user repository



        public EventAppService(IRepository<Event, Guid> eventRepository, IRepository<Label, Guid> labelRepository ,IRepository<EventsUsers, Guid> eventsUsersRepository, IRepository<Volo.Abp.Identity.IdentityUser, Guid> userRepository)

        {
            _eventRepository = eventRepository;
            _labelRepository = labelRepository;
            _eventsUsersRepository = eventsUsersRepository;
    _userRepository = userRepository;


        }

        public async Task CreateAsync(CreateEventDto @event)
        {

            Guid? eventId = null;


            try
            {
                var eventEntity = new Event
                {
                    Name = @event.Name,
                    StartTime = @event.StartTime,
                    EndTime = @event.EndTime,
                    Location = @event.Location,
                };

             var instertedEvent=    await _eventRepository.InsertAsync(eventEntity);

                if (@event.Labels != null && @event.Labels.Count > 0)
                {
                    foreach (var label in @event.Labels)
                    {
                        var labelEntity = new Label
                        {
                            EventId = eventEntity.Id,
                            Name = label.Name,
                            Color = label.Color
                        };
                        await _labelRepository.InsertAsync(labelEntity);
                    }
                }
              
                foreach (var userId in @event.UserIds)
                {
                    var eventUser = new EventsUsers
                    {
                        EventId = instertedEvent.Id,
                        UserId = userId
                    };
                    await _eventsUsersRepository.InsertAsync(eventUser);
                }

            }
              catch (Exception ex)
            {
                Logger.LogError("An error occurred while creating the event: " + ex.Message);
                throw new UserFriendlyException("An error occurred while creating the event.");
            }
        }

        public async Task<EventDto> GetAsync(Guid id)
        {
            try
            {
                var eventEntity = await _eventRepository.WithDetails(e => e.Labels)
                                                         .FirstOrDefaultAsync(i => i.Id == id);
                var eventUsers = await _eventsUsersRepository.GetListAsync();



                if (eventEntity == null)
                {
                    throw new UserFriendlyException("Event not found.");
                }
                return ObjectMapper.Map<Event, EventDto>(eventEntity);
            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while fetching the event: " + ex.Message);
                throw new UserFriendlyException("An error occurred while fetching the event.");
            }
        }

        public async Task<List<EventDto>> GetAllAsync()
        {

            try
            {
                // Fetch events with their associated Labels and EventUsers
                var events = await _eventRepository
                    .WithDetailsAsync(e => e.Labels, e => e.EventUsers);

                // Convert to List for easier manipulation
                var eventList = events.ToList();

                // Map to DTO
                var eventDtoList = ObjectMapper.Map<List<Event>, List<EventDto>>(eventList);

                // Loop through each event DTO to populate the Users list
                for (int i = 0; i < eventDtoList.Count; i++)
                {
                    // Fetch corresponding Event entity
                    var correspondingEvent = eventList[i];

                    // Initialize the Users list for the current event DTO
                    eventDtoList[i].Users = new List<Volo.Abp.Identity.IdentityUser>();

                    // Populate the Users list based on the EventUsers collection
                    foreach (var eventUser in correspondingEvent.EventUsers)
                    {
                        // Fetch the user by UserId (Assuming you have a method to get a user by Id)
                        var user = await _userRepository.GetListAsync();

                        // Add the user to the current event DTO's Users list
                        eventDtoList[i].Users.AddRange(user);
                    }
                }

                return eventDtoList;
            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while fetching the event: " + ex.Message);
                throw new UserFriendlyException("An error occurred while fetching the event.");
            }
        }

      

        public async Task DeleteAsync(Guid id)
        {
            try
            {
                var eventEntity = await _eventRepository.GetAsync(id);
                if (eventEntity == null)
                {
                    throw new UserFriendlyException("Event not found.");
                }

                await _eventRepository.DeleteAsync(id);
            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while deleting the event: " + ex.Message);
                throw new UserFriendlyException("An error occurred while deleting the event.");
            }
        }

        public async Task UpdateAsync(Guid id, CreateEventDto @event)
        {
            try
            {

                var eventEntity = await _eventRepository.WithDetails(e => e.Labels).FirstOrDefaultAsync(i => i.Id == id);

                if (eventEntity == null)
                {
                    throw new UserFriendlyException("Event not found.");
                }

                eventEntity.Name = @event.Name;
            eventEntity.StartTime = @event.StartTime;
            eventEntity.EndTime = @event.EndTime;
            eventEntity.Location = @event.Location;
            await _eventRepository.UpdateAsync(eventEntity);

            var existingLabelsDict = eventEntity.Labels.ToDictionary(l => l.Name, l => l);

            var finalLabels = new List<Label>();

            foreach (var oldLabel in eventEntity.Labels)
            {

                await _labelRepository.DeleteAsync(oldLabel); 
               }

            foreach (var eventLabel in @event.Labels)
            {

                if (existingLabelsDict.TryGetValue(eventLabel.Name, out var existingLabel))
                {
                    existingLabel.Color = eventLabel.Color;


                    await _labelRepository.InsertAsync(new Label
                    {
                        Name = eventLabel.Name,
                        Color = eventLabel.Color,
                        EventId = id
                    });
                }
                else
                {
                   

                    await _labelRepository.InsertAsync(new Label
                    {
                        Name = eventLabel.Name,
                        Color = eventLabel.Color,
                        EventId = id
                    });
                }
            }

        }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while updating the event: " + ex.Message);
                throw new UserFriendlyException("An error occurred while updating the event.");
}


        }



    }

}
