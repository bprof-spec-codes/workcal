﻿using Volo.Abp.Domain.Entities;

namespace workcal.Entities
{
    public class Label : BasicAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public string Color { get; set; }  // Hex or RGB code for label color
        public Event Event { get; set; }  // Navigation property


        
    
    }
}