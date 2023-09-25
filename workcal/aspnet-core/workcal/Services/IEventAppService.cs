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
    }
}
