using System.ComponentModel.DataAnnotations;

namespace GameBookingAPI.Models
{
    public class Food
    {
        [Key]
        public int FoodId { get; set; }

        public string FoodName { get; set; }

        public decimal Price { get; set; }
    }
}
