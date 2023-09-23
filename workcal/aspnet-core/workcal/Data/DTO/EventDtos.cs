namespace workcal.Data.DTO
{
    using System;
    using System.Collections.Generic;

    namespace workcal.Dtos
    {
        public class CreateEventDto
        {
            public string Name { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public string Location { get; set; }
          //  public List<Guid> AssignedWorkerIds { get; set; }
            // Add any other properties that are required for creating an Event
        }


        namespace workcal.Dtos
        {
            public class UpdateEventDto : CreateEventDto
            {
                // Inherits all properties from CreateEventDto
                // Add any additional properties that are required for updating an Event
            }
        }


    }

}
