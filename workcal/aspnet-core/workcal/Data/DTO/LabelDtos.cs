namespace workcal.Data.DTO
{
    
        public class CreateLabelDto
        {
            public string Name { get; set; }
            public string Color { get; set; }
            // Add any additional properties that are required for creating a Label
        }
    

   
        public class UpdateLabelDto : CreateLabelDto
        {
            // Inherits all properties from CreateLabelDto
            // Add any additional properties that are only required for updating a Label
        }
    



}
