using Volo.Abp.Domain.Entities;
using Volo.Abp.Identity;

namespace workcal.Entities
{
    public class Picture : BasicAggregateRoot<Guid>
    {
        public string Title { get; set; } // Username
        public byte[] ImageData { get; set; } // Store the image data directly
        public string ContentType { get; set; } // e.g., "image/png"
        public Guid UserId { get; set; }
        public IdentityUser User { get; set; }
    }

}
