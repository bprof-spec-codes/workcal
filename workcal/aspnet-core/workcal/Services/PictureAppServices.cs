using AutoMapper.Internal.Mappers;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using workcal.Entities;
using workcal.Services.Dtos;

namespace workcal.Services
{
    public class PictureAppService : ApplicationService, IPicturelAppService
    {
        private readonly IRepository<Picture, Guid> _pictureRepository;

        public PictureAppService(IRepository<Picture, Guid> pictureRepository)
        {
            _pictureRepository = pictureRepository;
        }



        [HttpPost("uploadPicture")]
        public async Task UploadPicture(IFormFile file, Guid userId)
        {

            try
            {
                // Example validation criteria
                var allowedFileTypes = new List<string> { "image/jpeg", "image/png" };
                var maxFileSize = 5 * 1024 * 1024; // 5 MB

                if (file.Length > maxFileSize)
                {
                    throw new UserFriendlyException("File size exceeds the allowable limit.");

                }

                if (!allowedFileTypes.Contains(file.ContentType))
                {
                    throw new UserFriendlyException("Invalid file type.");
                }

                byte[] fileData;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    fileData = memoryStream.ToArray();
                }

                var picture = new Picture
                {
                    Title = userId.ToString(), // You can set this based on the user ID
                    ImageData = fileData,
                    ContentType = file.ContentType,
                    UserId = userId // Assuming this is passed to the method
                };

                // Assuming you have a repository or context to interact with your database
                await _pictureRepository.InsertAsync(picture);

            }
            catch (UserFriendlyException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while uploading: " + ex.Message);
                throw new UserFriendlyException("An error occurred while uploading.");
            }

           




        }

        public async Task<PictureDto> GetImage(string id)
        {

            var images = await _pictureRepository.GetListAsync();

            var image = images.FirstOrDefault(x=> x.Title == id);

          // var image = await _pictureRepository.GetAsync(id);

          // return ObjectMapper.Map<Picture, PictureDto>(image);

            PictureDto p = new PictureDto
            {
                Id = image.Id,
                Title = image.Title,
                ImageData = image.ImageData,
                ContentType = image.ContentType,
                UserId=image.UserId,
            };

            return p;

        }

        [HttpGet("getImages")]
        public async Task<IEnumerable<PictureDto>> GetImages()
        {
            var images = await _pictureRepository.GetListAsync();

            return images.Select(image => new PictureDto
            {
                Id = image.Id,
                Title = image.Title,
                ImageData = image.ImageData,
                ContentType = image.ContentType,
                UserId = image.UserId,
            });
        }

        [HttpPut("updateImage")]
        public async Task UpdateImage(PictureDto pictureDto)
        {
            var picture = await _pictureRepository.GetAsync(pictureDto.Id);

            if (picture is null)
            {
                throw new UserFriendlyException($"Could not find image with ID {pictureDto.Id}");
            }

            picture.Title = pictureDto.Title;
            picture.ImageData = pictureDto.ImageData;
            picture.ContentType = pictureDto.ContentType;
            picture.UserId=pictureDto.UserId;

            await _pictureRepository.UpdateAsync(picture);
        }


        [HttpDelete("deleteImage")]
        public async Task DeleteImage(Guid id)
        {
            var picture = await _pictureRepository.GetAsync(id);

            if (picture is null)
            {
                throw new UserFriendlyException($"Could not find image with ID {id}");
            }

            await _pictureRepository.DeleteAsync(picture);
        }


    }
}
