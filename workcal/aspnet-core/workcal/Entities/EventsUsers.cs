using Volo.Abp.Identity;
using static Volo.Abp.Identity.Settings.IdentitySettingNames;

namespace workcal.Entities
{
    public class EventsUsers
    {
        public Guid UserId { get; set; }
        public IdentityUser User { get; set; }
        public Guid EventId { get; set; }
        public Event Event { get; set; }
    }
}
