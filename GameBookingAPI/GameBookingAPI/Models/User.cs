using System.ComponentModel.DataAnnotations;

namespace GameBookingAPI.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        public string Name { get; set; }

        public string? Email { get; set; }


        public string Phone { get; set; }

        public string Password { get; set; }

        public string SelectedCity { get; set; }

        public string DetectedCity { get; set; }

        public bool IsGpsEnabled { get; set; }

        public bool IsEligible { get; set; }

        public bool IsVerified { get; set; }
    }
}
