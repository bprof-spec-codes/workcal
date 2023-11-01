using Volo.Abp.Identity;
using static Volo.Abp.Identity.Settings.IdentitySettingNames;
using Microsoft.AspNetCore.Http.HttpResults;
using Volo.Abp.Domain.Entities;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Net;
using Volo.Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Diagnostics.CodeAnalysis;

namespace workcal.Entities
{
    public class EventsUsers : BasicAggregateRoot<Guid>
    {
        public Guid UserId { get; set; }
        [AllowNull]
        public IdentityUser User { get; set; }

        public Guid EventId { get; set; }
        [AllowNull]
        public Event Event { get; set; }

        public EventsUsers() { }
        public EventsUsers(Guid userId, Guid eventId) { UserId = userId; EventId = eventId; }
        public override object[] GetKeys() { return new object[]{ UserId, EventId }; }



    }
}
