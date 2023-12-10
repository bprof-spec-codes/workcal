using System.ComponentModel.DataAnnotations;

namespace workcal.Services.Dtos
{
    // DTO for creating a new Label
    public class CreateLabelDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Color { get; set; }

        public Guid EventId { get; set; }

    }

}
