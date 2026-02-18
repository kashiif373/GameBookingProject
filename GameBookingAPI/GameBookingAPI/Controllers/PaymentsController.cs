using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using System.Linq;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        // DUMMY PAYMENT
        [HttpPost("{bookingId}")]
        public IActionResult MakePayment(int bookingId)
        {
            var booking = _context.Bookings
                .FirstOrDefault(b => b.BookingId == bookingId);

            if (booking == null)
                return BadRequest("Booking not found");

            // Simulate payment success
            booking.PaymentStatus = "Paid";

            _context.SaveChanges();

            return Ok(new
            {
                Message = "Payment successful",
                BookingId = bookingId,
                Status = "Paid"
            });
        }
    }
}
