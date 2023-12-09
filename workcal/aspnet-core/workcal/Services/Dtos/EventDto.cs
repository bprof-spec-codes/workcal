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
        public string LocationString { get; set; }
        public List<Label> Labels { get; set; }
        public byte[]? PictureData { get; set; } // Binary data of the picture

        public List<Volo.Abp.Identity.IdentityUser> Users { get; set; }


    }
}
