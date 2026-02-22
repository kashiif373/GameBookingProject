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

        // ==============================
        // CREATE BOOKING
        // ==============================
        [HttpPost]
        public IActionResult CreateBooking(Booking booking)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == booking.UserId);

            if (user == null)
                return BadRequest("User not found");

            booking.PaymentStatus = "Pending";
            booking.PaymentMethod = "Not Selected";

            _context.Bookings.Add(booking);
            _context.SaveChanges();

            return Ok(new { BookingId = booking.BookingId });
        }

        // ==============================
        // UPDATE PAYMENT STATUS + METHOD
        // ==============================
        [HttpPut("{id}")]
        public IActionResult UpdatePayment(int id, [FromBody] Booking updatedBooking)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == id);

            if (booking == null)
                return NotFound("Booking not found");

            booking.PaymentStatus = updatedBooking.PaymentStatus;
            booking.PaymentMethod = updatedBooking.PaymentMethod;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Payment updated successfully",
                booking.BookingId,
                booking.PaymentStatus,
                booking.PaymentMethod
            });
        }

        // ==============================
        // BOOKING HISTORY
        // ==============================
        [HttpGet("history/{userId}")]
        public IActionResult GetBookingHistory(int userId)
        {
            var history = _context.Bookings
                .Where(b => b.UserId == userId)
                .Select(b => new BookingHistoryDTO
                {
                    BookingId = b.BookingId,

                    GameName = _context.Games
                        .Where(g => g.GameId == b.GameId)
                        .Select(g => g.GameName)
                        .FirstOrDefault(),

                    LocationName = _context.Locations
                        .Where(l => l.LocationId == b.LocationId)
                        .Select(l => l.LocationName)
                        .FirstOrDefault(),

                    BookingDate = b.BookingDate,
                    TimeSlot = b.TimeSlot,
                    TotalAmount = b.TotalAmount,
                    PaymentStatus = b.PaymentStatus,
                    PaymentMethod = b.PaymentMethod,

                    Foods = _context.BookingFoods
                        .Where(bf => bf.BookingId == b.BookingId)
                        .Select(bf => new FoodDTO
                        {
                            FoodName = _context.Foods
                                .Where(f => f.FoodId == bf.FoodId)
                                .Select(f => f.FoodName)
                                .FirstOrDefault(),
                            Quantity = bf.Quantity
                        }).ToList()
                })
                .ToList();

            return Ok(history);
        }
    }
}
