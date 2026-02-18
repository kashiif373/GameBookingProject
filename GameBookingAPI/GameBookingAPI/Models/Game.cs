using System.ComponentModel.DataAnnotations;

namespace GameBookingAPI.Models
{
    public class Game
    {
        [Key]
        public int GameId { get; set; }

        public string GameName { get; set; }
    }
}
