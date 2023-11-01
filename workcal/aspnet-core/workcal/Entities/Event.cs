using workcal.Data;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using Volo.Abp.Domain.Entities;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Identity;
using Volo.Abp.Domain.Entities.Auditing;
using System.Collections.ObjectModel;

namespace workcal.Entities
{
    public class Event : BasicAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string Location { get; set; }

        [ValidateNever]
        [JsonIgnore]
        public List<Label> Labels { get; set; }

        [ValidateNever]
    
        public ICollection<EventsUsers> EventUsers { get; set; }

        public Event() {
        }

    }

}
