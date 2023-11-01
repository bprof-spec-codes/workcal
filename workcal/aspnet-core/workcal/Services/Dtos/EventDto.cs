﻿using Microsoft.AspNetCore.Identity;
using System;
using workcal.Entities;

namespace workcal.Services.Dtos

{
    public class EventDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public List<Label> Labels { get; set; }

        public List<Guid> UserIds { get; set; }


    }
}
