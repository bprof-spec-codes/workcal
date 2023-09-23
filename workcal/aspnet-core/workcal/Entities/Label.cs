using Volo.Abp.Domain.Entities;

namespace workcal.Entities
{
    public class Label : IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }  // Hex or RGB code for label color
        public ICollection<Event> Events { get; set; }  // Navigation property

        object[] IEntity.GetKeys()
        {
            throw new NotImplementedException();
        }
    }
}
