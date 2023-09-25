using Volo.Abp.Application.Services;
using workcal.Services.Dtos;

namespace workcal.Services
{
    public interface ILabelAppService : IApplicationService
    {
        Task CreateAsync(CreateLabelDto input);
        Task<LabelDto> GetAsync(Guid id);
        Task<List<LabelDto>> GetAllAsync();  // New method for getting all labels
        Task DeleteAsync(Guid id);  // New method for deleting a label by id
        Task UpdateAsync(Guid id, CreateLabelDto input);  // New method for updating a label
    }
}
