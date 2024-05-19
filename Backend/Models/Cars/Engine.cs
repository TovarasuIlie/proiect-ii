namespace Backend.Models.Cars
{
    public class Engine
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Model ModelId { get; set; }= new Model();
    }
}
