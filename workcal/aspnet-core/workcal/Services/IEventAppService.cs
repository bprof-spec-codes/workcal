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
        Task UploadPicture(IFormFile file, Guid userId);
        Task DeleteAsync(Guid id);  
        Task UpdateAsync(Guid id, CreateEventDto @event);  
    }

}
