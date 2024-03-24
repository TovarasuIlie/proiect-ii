namespace Backend.Models.Shop
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Category Category { get; set; }= new Category();
        public string TechnicalDetailsJson { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
