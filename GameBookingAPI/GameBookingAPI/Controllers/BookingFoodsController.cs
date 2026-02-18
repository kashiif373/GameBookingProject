using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using GameBookingAPI.Models;
using System.Linq;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingFoodsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingFoodsController(AppDbContext context)
        {
            _context = context;
        }

        // ADD FOOD TO BOOKING
        [HttpPost]
        public IActionResult AddFoodToBooking(BookingFood bookingFood)
        {
            _context.BookingFoods.Add(bookingFood);
            _context.SaveChanges();

            return Ok("Food added to booking successfully");
        }

        // GET FOODS BY BOOKING
        [HttpGet("{bookingId}")]
        public IActionResult GetFoodsByBooking(int bookingId)
        {
            var foods = _context.BookingFoods
                .Where(b => b.BookingId == bookingId)
                .ToList();

            return Ok(foods);
        }
    }
}
