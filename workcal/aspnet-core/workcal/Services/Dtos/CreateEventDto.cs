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
        public string Description { get; set; }

        public string LocationString { get; set; } // User-provided location description
        public double? Latitude { get; set; } // GPS latitude
        public double? Longitude { get; set; } // GPS longitude
        public byte[]? PictureData { get; set; } // Binary data of the picture
        public string? PictureMimeType { get; set; } // MIME type of the picture
        public bool? IsInRange { get; set; }

        public List<CreateLabelDto> Labels { get; set; }

        public List<Guid> Users { get; set; }

    }
}
