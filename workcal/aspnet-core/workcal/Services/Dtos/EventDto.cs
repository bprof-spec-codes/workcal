using Microsoft.AspNetCore.Identity;
using System;
using Volo.Abp.Identity;
using workcal.Entities;

namespace workcal.Services.Dtos

{
    public class EventDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Description { get; set; }

        public string LocationString { get; set; } // User-provided location description
        public double? Latitude { get; set; } // GPS latitude
        public double? Longitude { get; set; } // GPS longitude


        public byte[]? PictureData { get; set; } // Binary data of the picture
        public string? PictureMimeType { get; set; } // MIME type of the picture

        public bool? IsInRange { get; set; }

        public List<Label> Labels { get; set; }

        public List<Volo.Abp.Identity.IdentityUser> Users { get; set; }


    }
}
