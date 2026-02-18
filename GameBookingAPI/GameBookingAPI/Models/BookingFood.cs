using System.ComponentModel.DataAnnotations;

namespace GameBookingAPI.Models
{
    public class BookingFood
    {
        [Key]
        public int Id { get; set; }

        public int BookingId { get; set; }
        public int FoodId { get; set; }
        public int Quantity { get; set; }
    }
}
