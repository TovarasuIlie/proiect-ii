namespace Backend.Models.Cars
{
    public class Model
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Mark MarkId { get; set; }=new Mark();
    }
}
