using Volo.Abp.Application.Services;
using workcal.Services.Dtos;

namespace workcal.Services
{
    public interface ILabelAppService : IApplicationService
    {
        Task CreateAsync(CreateLabelDto input);
        Task<LabelDto> GetAsync(Guid id);
        Task<List<LabelDto>> GetAllAsync();
        Task<List<LabelDto>> GetUniqueLabelsAsync();
        Task DeleteLabelsAsync(string labelName, string labelColor);

        Task DeleteAsync(Guid id);  
        Task UpdateAsync(Guid id, CreateLabelDto input);  
    }
}
