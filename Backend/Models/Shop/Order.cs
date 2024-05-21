using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Shop
{
    public class Order
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string UserId { get; set; }
        public bool IsConfirmed { get; set; }
        public ICollection<OrderDetails> OrderDetails { get; set; }
    }
}
