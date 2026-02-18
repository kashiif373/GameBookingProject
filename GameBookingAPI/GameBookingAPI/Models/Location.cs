using System.ComponentModel.DataAnnotations;

namespace GameBookingAPI.Models
{
    public class Location
    {
        [Key]
        public int LocationId { get; set; }

        public int GameId { get; set; }

        public string LocationName { get; set; }

        public string City { get; set; }

        public decimal PricePerHour { get; set; }
    }
}
