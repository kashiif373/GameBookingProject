using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using GameBookingAPI.Models;
using System.Linq;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // CREATE BOOKING
        [HttpPost]
        public IActionResult CreateBooking(Booking booking)
        {
            // Get user
            var user = _context.Users.FirstOrDefault(u => u.UserId == booking.UserId);

            if (user == null)
                return BadRequest("User not found");

            // Check eligibility
            if (!user.IsEligible)
                return BadRequest("Booking not allowed for your location");

            // Save booking
            booking.PaymentStatus = "Pending";

            _context.Bookings.Add(booking);
            _context.SaveChanges();

            return Ok(new
            {
                Message = "Booking created successfully",
                BookingId = booking.BookingId
            });
        }

        // GET BOOKINGS BY USER
        [HttpGet("user/{userId}")]
        public IActionResult GetUserBookings(int userId)
        {
            var bookings = _context.Bookings
                .Where(b => b.UserId == userId)
                .ToList();

            return Ok(bookings);
        }
    }
}
