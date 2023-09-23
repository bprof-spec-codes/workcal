using workcal.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using Volo.Abp.Domain.Entities;

namespace workcal.Entities
{
    public class Event : IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Guid LabelId { get; set; }
        public Label Label { get; set; }
        public string Location { get; set; }

        public Guid WorkerId { get; set; }

        public Guid ManagerId { get; set; }

        public object[] GetKeys()
        {
            return ((IEntity)Label).GetKeys();
        }
    }

}
