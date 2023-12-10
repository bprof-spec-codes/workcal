
using Volo.Abp.Application.Services;
using workcal.Entities;
using workcal.Services.Dtos;

namespace workcal.Services
{
    public interface IPicturelAppService : IApplicationService
    {

        Task UploadPicture(IFormFile file, Guid userId);
        Task UpdateImage(PictureDto pictureDto);
        Task<IEnumerable<PictureDto>> GetImages();
        Task<PictureDto> GetImage(string id);
    }
}
