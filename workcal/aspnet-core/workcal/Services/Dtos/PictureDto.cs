namespace workcal.Services.Dtos
{
    public class PictureDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public byte[] ImageData { get; set; }

        public string ContentType { get; set; }

        public Guid UserId { get; set; }
    }

}
