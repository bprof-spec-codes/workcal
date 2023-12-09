using AutoMapper.Internal.Mappers;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using workcal.Entities;
using workcal.Services.Dtos;

namespace workcal.Services
{
    public class LabelAppService : ApplicationService, ILabelAppService
    {
        private readonly IRepository<Label, Guid> _labelRepository;

        public LabelAppService(IRepository<Label, Guid> labelRepository)
        {
            _labelRepository = labelRepository;
        }

        public async Task CreateAsync(CreateLabelDto input)
        {
            try
            {
                var label = new Label
            {
                EventId = input.EventId,
                Name = input.Name,
                Color = input.Color
            };
            await _labelRepository.InsertAsync(label);
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while creating the label: " + ex.Message);
                throw new UserFriendlyException("An error occurred while creating the label.");
            }
        }

        public async Task<LabelDto> GetAsync(Guid id)
        {
            try
            {
                var label = await _labelRepository.GetAsync(id);

                if (label == null)
                {
                    throw new UserFriendlyException("Label not found.");
                }
                return ObjectMapper.Map<Label, LabelDto>(label);
            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while fetching the label: " + ex.Message);
                throw new UserFriendlyException("An error occurred while fetching the label.");
            }
        }

        public async Task<List<LabelDto>> GetAllAsync()
        {
            try
            {
                var labels = await _labelRepository.GetListAsync();
            return ObjectMapper.Map<List<Label>, List<LabelDto>>(labels);
            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while fetching the label: " + ex.Message);
                throw new UserFriendlyException("An error occurred while fetching the label.");
            }
        }

       
        [HttpGet("unique")]
        public async Task<List<LabelDto>> GetUniqueLabelsAsync()
        {
            var labels = await _labelRepository.GetQueryableAsync();
            var uniqueLabels = labels
                .GroupBy(label => new { label.Name, label.Color })
                .Select(group => group.First())
                .ToList();

            return ObjectMapper.Map<List<Label>, List<LabelDto>>(uniqueLabels);
        }

        [HttpDelete("deleteByNameAndColor")]
        public async Task DeleteLabelsAsync(string labelName, string labelColor)
        {
            var labels = await _labelRepository.GetListAsync(label => label.Name == labelName && label.Color == labelColor);

            foreach (var label in labels)
            {
                await _labelRepository.DeleteAsync(label);
            }
        }



        public async Task DeleteAsync(Guid id)
        {
            try
            {
                var label = await _labelRepository.GetAsync(id);

                if (label == null)
                {
                    throw new UserFriendlyException("Label not found.");
                }
                await _labelRepository.DeleteAsync(id);

            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while deleting the label: " + ex.Message);
                throw new UserFriendlyException("An error occurred while deleting the label.");
            }
        }

        public async Task UpdateAsync(Guid id, CreateLabelDto input)
        {
            try
            {
                var label = await _labelRepository.GetAsync(id);

                if (label == null)
                {
                    throw new UserFriendlyException("Label not found.");
                }

            label.Name = input.Name;  
            label.Color = input.Color;
            label.EventId = input.EventId;

            await _labelRepository.UpdateAsync(label);

            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while updating the label: " + ex.Message);
                throw new UserFriendlyException("An error occurred while updating the label.");
            }
        }
    }

}
