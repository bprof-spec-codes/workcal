using AutoMapper;
using Volo.Abp.Application.Dtos;
using workcal.Entities;
using workcal.Services.Dtos;

namespace workcal.Services
{
    public class WorkcalProfile : Profile
    {
        public WorkcalProfile()
        {
            CreateMap<Event, EventDto>();
            CreateMap<CreateEventDto, Event>();
            

        }
    }
}
