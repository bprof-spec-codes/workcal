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

        // Dependency injection for IRepository
        public LabelAppService(IRepository<Label, Guid> labelRepository)
        {
            _labelRepository = labelRepository;
        }

        // Create new Label
        public async Task CreateAsync(CreateLabelDto input)
        {
            var label = new Label
            {
               // Id = GuidGenerator.Create(),
                Name = input.Name,
                Color = input.Color
                // EventId = input.EventId if you wish to associate it during creation
            };

            await _labelRepository.InsertAsync(label);
        }

        // Get a Label by Id
        public async Task<LabelDto> GetAsync(Guid id)
        {
            var label = await _labelRepository.GetAsync(id);
            return ObjectMapper.Map<Label, LabelDto>(label);
        }
    }

}
