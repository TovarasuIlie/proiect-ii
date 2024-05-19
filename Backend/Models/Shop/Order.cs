namespace Backend.Models.Shop
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public bool IsConfirmed { get; set; }
        public ICollection<OrderDetails> OrderDetails { get; set; }
    }
}
