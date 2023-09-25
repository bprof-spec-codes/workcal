using AutoMapper;
using workcal.Entities;
using workcal.Services.Dtos;

namespace workcal.Services
{
    // AutoMapper Profile
    public class LabelProfile : Profile
    {
        public LabelProfile()
        {
            CreateMap<Label, LabelDto>();
            CreateMap<CreateLabelDto, Label>();
        }
    }

}
