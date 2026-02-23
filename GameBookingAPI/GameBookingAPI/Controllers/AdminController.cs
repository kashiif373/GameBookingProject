using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GameBookingAPI.Data;
using GameBookingAPI.Models;
using System.Linq;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // ================= DASHBOARD STATS (UPDATED FOR CHARTS) =================
        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var totalUsers = _context.Users.Count();
            var totalBookings = _context.Bookings.Count();

            decimal totalRevenue = _context.Bookings.Any()
                ? _context.Bookings.Sum(b => b.TotalAmount)
                : 0;

            // ⭐ MONTHLY REVENUE FOR CHARTS
            var monthlyRevenue = _context.Bookings
                .GroupBy(b => b.BookingDate.Month)
                .Select(g => new
                {
                    month = g.Key,
                    revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.month)
                .ToList();

            return Ok(new
            {
                totalUsers,
                totalBookings,
                totalRevenue,
                monthlyRevenue   // ⭐ NEW FIELD
            });
        }

        // ================= GAMES =================

        [HttpGet("games")]
        public IActionResult GetGames()
        {
            return Ok(_context.Games.ToList());
        }

        [HttpPost("games")]
        public IActionResult AddGame([FromBody] Game game)
        {
            if (string.IsNullOrEmpty(game.GameName))
                return BadRequest("Game name required");

            _context.Games.Add(game);
            _context.SaveChanges();

            return Ok("Game added successfully");
        }

        [HttpPut("games/{id}")]
        public IActionResult UpdateGame(int id, [FromBody] Game updated)
        {
            var game = _context.Games.Find(id);
            if (game == null) return NotFound("Game not found");

            game.GameName = updated.GameName;
            _context.SaveChanges();

            return Ok("Game updated successfully");
        }

        [HttpDelete("games/{id}")]
        public IActionResult DeleteGame(int id)
        {
            var game = _context.Games.Find(id);
            if (game == null) return NotFound("Game not found");

            _context.Games.Remove(game);
            _context.SaveChanges();

            return Ok("Game deleted");
        }

        // ================= LOCATIONS =================

        [HttpGet("locations")]
        public IActionResult GetLocations()
        {
            return Ok(_context.Locations.ToList());
        }

        [HttpPost("locations")]
        public IActionResult AddLocation([FromBody] Location loc)
        {
            _context.Locations.Add(loc);
            _context.SaveChanges();

            return Ok("Location added");
        }

        [HttpPut("locations/{id}")]
        public IActionResult UpdateLocation(int id, Location updated)
        {
            var loc = _context.Locations.Find(id);
            if (loc == null) return NotFound("Location not found");

            loc.LocationName = updated.LocationName;
            loc.City = updated.City;
            loc.PricePerHour = updated.PricePerHour;
            loc.GameId = updated.GameId;

            _context.SaveChanges();
            return Ok("Location updated");
        }

        [HttpDelete("locations/{id}")]
        public IActionResult DeleteLocation(int id)
        {
            var loc = _context.Locations.Find(id);
            if (loc == null) return NotFound("Location not found");

            _context.Locations.Remove(loc);
            _context.SaveChanges();

            return Ok("Location deleted");
        }

        // ================= USERS =================

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            return Ok(_context.Users.ToList());
        }

        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound("User not found");

            if (user.Role == "Admin")
                return BadRequest("Cannot delete admin");

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok("User deleted");
        }

        // ================= BOOKINGS =================

        [HttpGet("bookings")]
        public IActionResult GetBookings()
        {
            return Ok(_context.Bookings.ToList());
        }

        [HttpDelete("bookings/{id}")]
        public IActionResult CancelBooking(int id)
        {
            var booking = _context.Bookings.Find(id);
            if (booking == null) return NotFound("Booking not found");

            _context.Bookings.Remove(booking);
            _context.SaveChanges();

            return Ok("Booking cancelled");
        }
    }
}