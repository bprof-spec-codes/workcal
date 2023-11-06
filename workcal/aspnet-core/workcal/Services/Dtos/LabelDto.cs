using Volo.Abp.Application.Dtos;

namespace workcal.Services.Dtos
{
    // DTO for transferring Label data
    public class LabelDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Color { get; set; }

        public Guid EventId { get; set; }
    }

}
