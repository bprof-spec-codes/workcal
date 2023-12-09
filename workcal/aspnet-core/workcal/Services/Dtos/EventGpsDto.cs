namespace workcal.Services.Dtos
{
    public class EventGpsDto
    {
        public Guid EventId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsInRange { get; set; }
    }

}
