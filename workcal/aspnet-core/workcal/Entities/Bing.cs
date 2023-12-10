namespace workcal.Entities
{
    public class BingMapsResponse
    {
        public List<ResourceSet> ResourceSets { get; set; }
    }

    public class ResourceSet
    {
        public List<Resource> Resources { get; set; }
    }

    public class Resource
    {
        public Point Point { get; set; }
    }

    public class Point
    {
        public List<double> Coordinates { get; set; }
    }

}
