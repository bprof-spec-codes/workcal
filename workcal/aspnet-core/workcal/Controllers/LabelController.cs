using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Volo.Abp.Domain.Repositories;
using workcal.Entities;
using Microsoft.EntityFrameworkCore;
using workcal.Data.DTO;

namespace workcal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Controller for handling labels
    [Route("api/labels")]
    public class LabelsController : ControllerBase
    {
        private  ILabelRepository _labelRepository;

        public LabelsController(ILabelRepository labelRepository)
        {
            _labelRepository = labelRepository;
        }

        public ILabelRepository labelRepository { get => _labelRepository; set => _labelRepository = value; }


        [HttpGet]
        public async Task<IEnumerable<Label>> GetLabels()
        {
            return await _labelRepository.GetAllLabelsAsync();
        }

        [HttpPost]
        public async Task CreateLabel(CreateLabelDto input)
        {
            var newLabel = new Label
            {
                Name = input.Name,
                Color = input.Color,
                // Set other properties from input
            };
            await _labelRepository.AddLabelAsync(newLabel);
        }

        [HttpPut("{id}")]
        public async Task UpdateLabel(Guid id, UpdateLabelDto input)
        {
            var labelToUpdate = await _labelRepository.GetLabelByIdAsync(id);
            if (labelToUpdate != null)
            {
                labelToUpdate.Name = input.Name;
                labelToUpdate.Color = input.Color;
                // Update other properties from input

                await _labelRepository.UpdateLabelAsync(labelToUpdate);
            }
        }

        [HttpDelete("{id}")]
        public async Task DeleteLabel(Guid id)
        {
            await _labelRepository.DeleteLabelAsync(id);
        }
    }

}
