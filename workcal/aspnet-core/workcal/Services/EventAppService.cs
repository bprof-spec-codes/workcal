using System;
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
using workcal.Migrations;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace workcal.Services
{
    public class EventAppService : ApplicationService, IEventAppService
    {
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Label, Guid> _labelRepository;
        private readonly IRepository<Picture, Guid> _pictureRepository;

        private readonly IRepository<Entities.EventsUsers, Guid> _eventsUsersRepository;
        private readonly IRepository<Volo.Abp.Identity.IdentityUser, Guid> _userRepository; // Inject the user repository



        public EventAppService(IRepository<Event, Guid> eventRepository, IRepository<Label, Guid> labelRepository , IRepository<Picture, Guid> pictureRepository, IRepository<Entities.EventsUsers, Guid> eventsUsersRepository, IRepository<Volo.Abp.Identity.IdentityUser, Guid> userRepository)

        {
            _eventRepository = eventRepository;
            _labelRepository = labelRepository;
            _pictureRepository = pictureRepository;
            _eventsUsersRepository = eventsUsersRepository;
             _userRepository = userRepository;


        }


        [HttpPost("upload")]
        public async Task UploadPicture(IFormFile file, Guid userId)
        {

            try
            {
                // Example validation criteria
                var allowedFileTypes = new List<string> { "image/jpeg", "image/png" };
                var maxFileSize = 5 * 1024 * 1024; // 5 MB

                if (file.Length > maxFileSize)
                {
                    throw new UserFriendlyException("File size exceeds the allowable limit.");

                }

                if (!allowedFileTypes.Contains(file.ContentType))
                {
                    throw new UserFriendlyException("Invalid file type.");
                }

                byte[] fileData;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    fileData = memoryStream.ToArray();
                }

                var picture = new Picture
                {
                    Title = userId.ToString(), // You can set this based on the user ID
                    ImageData = fileData,
                    ContentType = file.ContentType,
                    UserId = userId // Assuming this is passed to the method
                };

                // Assuming you have a repository or context to interact with your database
                await _pictureRepository.InsertAsync(picture);

            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while uploading: " + ex.Message);
                throw new UserFriendlyException("An error occurred while uploading.");
            }


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
              
                foreach (var userId in @event.Users)
                {
                    var eventUser = new Entities.EventsUsers
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

                var alleventUsers = await _eventsUsersRepository.GetListAsync();

                var alluser = await _userRepository.GetListAsync();






                if (eventEntity == null)
                {
                    throw new UserFriendlyException("Event not found.");
                }
                var eventDto = ObjectMapper.Map<Event, EventDto>(eventEntity);

                List<Entities.EventsUsers> eventusesEventid = alleventUsers.Where(i => i.EventId == eventEntity.Id  ).ToList();

                var usersInEvent = alluser.Where(u => eventusesEventid.Any(eu => eu.UserId == u.Id)).ToList();
                eventDto.Users = new List<Volo.Abp.Identity.IdentityUser>();


                eventDto.Users.AddRange(usersInEvent);


                return eventDto;



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

                var alluser = await _userRepository.GetListAsync();

                var allEventUsers = await _eventsUsersRepository.GetListAsync();

                // Loop through each event DTO to populate the Users list
                for (int i = 0; i < eventDtoList.Count; i++)
                {
                    // Fetch corresponding Event entity
                    var correspondingEvent = eventList[i];

                    // Initialize the Users list for the current event DTO
                    eventDtoList[i].Users = new List<Volo.Abp.Identity.IdentityUser>();

                     
                    

                    foreach (var user in alluser)
                    {
                        foreach (var eventuser in allEventUsers)
                        {
                            if (user.Id == eventuser.UserId && correspondingEvent.Id ==eventuser.EventId)
                            {
                                eventDtoList[i].Users.Add(user);
                                break;
                            }
                        }
                       
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

                await _eventRepository.DeleteAsync(id); // Delete entity
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
                var allEventUsers = await _eventsUsersRepository.GetListAsync();
                var existingEventUsers = allEventUsers.Where(eu => eu.EventId == id).ToList();

                foreach (var eventUser in existingEventUsers)
                {
                    await _eventsUsersRepository.DeleteAsync(eventUser);
                }

                // 2. Insert new Event-User relations based on updated event data
                foreach (var userId in @event.Users)
                {
                    var eventUser = new Entities.EventsUsers
                    {
                        EventId = id,
                        UserId = userId
                    };
                    await _eventsUsersRepository.InsertAsync(eventUser);
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
