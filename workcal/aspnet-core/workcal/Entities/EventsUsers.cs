using Volo.Abp.Identity;
using static Volo.Abp.Identity.Settings.IdentitySettingNames;
using Microsoft.AspNetCore.Http.HttpResults;
using Volo.Abp.Domain.Entities;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace workcal.Entities
{
    public class EventsUsers : BasicAggregateRoot<Guid>
    {
        public Guid UserId { get; set; }
        public IdentityUser User { get; set; }
        public Guid EventId { get; set; }
        public Event Event { get; set; }
    }
}
