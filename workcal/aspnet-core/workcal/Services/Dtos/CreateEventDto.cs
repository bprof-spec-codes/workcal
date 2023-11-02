using System;
using System.ComponentModel.DataAnnotations;
using workcal.Entities;

namespace workcal.Services.Dtos
{
    public class CreateEventDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public string Location { get; set; }

        public List<CreateLabelDto> Labels { get; set; }

        public List<Guid> Users { get; set; }

    }
}
