using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;

namespace workcal.Entities
{
    public class Label : BasicAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public string Color { get; set; }  // Hex or RGB code for label color
        public Guid EventId { get; set; } // Foreign key

        [NotMapped]
        [ValidateNever]
        [JsonIgnore]
        public Event Event { get; set; }  // Navigation property


        
    
    }
}
