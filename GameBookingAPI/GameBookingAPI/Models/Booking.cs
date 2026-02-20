using System.ComponentModel.DataAnnotations;

namespace GameBookingAPI.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        public int UserId { get; set; }
        public int GameId { get; set; }
        public int LocationId { get; set; }

        public DateTime BookingDate { get; set; }
        public string? TimeSlot { get; set; }


        public decimal TotalAmount { get; set; }
        public string? PaymentStatus { get; set; }
        public string? PaymentMethod { get; set; }

        // Razorpay fields
        public string? RazorpayOrderId { get; set; }
        public string? RazorpayPaymentId { get; set; }
    }
}
