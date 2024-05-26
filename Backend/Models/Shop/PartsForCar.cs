using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Shop
{
    public class PartsForCar
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int EngineId { get; set; }
    }
}
