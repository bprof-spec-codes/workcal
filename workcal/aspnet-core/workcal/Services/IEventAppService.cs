using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using workcal.Services.Dtos;

namespace workcal.Services


{
    public interface IEventAppService : IApplicationService
    {
        Task CreateAsync(CreateEventDto input);
        Task<EventDto> GetAsync(Guid id);
        Task<List<EventDto>> GetAllAsync();  // New method for getting all events
        Task DeleteAsync(Guid id);  // New method for deleting an event by id
        Task UpdateAsync(Guid id, CreateEventDto input);  // New method for updating an event
    }

}
