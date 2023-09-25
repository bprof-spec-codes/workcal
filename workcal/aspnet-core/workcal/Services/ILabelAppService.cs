using Volo.Abp.Application.Services;
using workcal.Services.Dtos;

namespace workcal.Services
{
    public interface ILabelAppService : IApplicationService
    {
        Task CreateAsync(CreateLabelDto input);
        Task<LabelDto> GetAsync(Guid id);
    }
}
