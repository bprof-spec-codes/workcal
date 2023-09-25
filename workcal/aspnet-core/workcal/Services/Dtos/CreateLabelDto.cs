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

        // Optionally, you can add EventId if you wish to associate it during creation
        public Guid EventId { get; set; }
    }

}
