using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using workcal.Services.Dtos;

namespace workcal.Services


{
    public interface IEventAppService : IApplicationService
    {
        Task CreateAsync(CreateEventDto @event);
        Task<EventDto> GetAsync(Guid id);
        Task<List<EventDto>> GetAllAsync();
        Task UploadEventPicture(IFormFile pictureFile, Guid eventId);
        Task DeleteAsync(Guid id);  
        Task UpdateAsync(Guid id, CreateEventDto @event);
        Task<object> GetCoordinates(string address);

        Task UpdateEventGpsDataAsync(EventGpsDto input);
    }

}
