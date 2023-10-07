using AutoMapper.Internal.Mappers;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using workcal.Entities;
using workcal.Services.Dtos;

namespace workcal.Services
{
    // Application Service Implementation
    public class LabelAppService : ApplicationService, ILabelAppService
    {
        private readonly IRepository<Label, Guid> _labelRepository;

        public LabelAppService(IRepository<Label, Guid> labelRepository)
        {
            _labelRepository = labelRepository;
        }

        public async Task CreateAsync(CreateLabelDto input)
        {
            var label = new Label
            {
                EventId = input.EventId,
                Name = input.Name,
                Color = input.Color
            };
            await _labelRepository.InsertAsync(label);
        }

        public async Task<LabelDto> GetAsync(Guid id)
        {
            var label = await _labelRepository.GetAsync(id);
            return ObjectMapper.Map<Label, LabelDto>(label);
        }

        // Implementation for getting all labels
        public async Task<List<LabelDto>> GetAllAsync()
        {
            var labels = await _labelRepository.GetListAsync();
            return ObjectMapper.Map<List<Label>, List<LabelDto>>(labels);
        }

        // Implementation for deleting a label by id
        public async Task DeleteAsync(Guid id)
        {
            await _labelRepository.DeleteAsync(id);
        }

        // Implementation for updating a label
        public async Task UpdateAsync(Guid id, CreateLabelDto input)
        {
            var label = await _labelRepository.GetAsync(id);  // Retrieve the existing label
            label.Name = input.Name;  // Update fields
            label.Color = input.Color;
            label.EventId = input.EventId;

            await _labelRepository.UpdateAsync(label);  // Update the label in the repository
        }
    }

}
