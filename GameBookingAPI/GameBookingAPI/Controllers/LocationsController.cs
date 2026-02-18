using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using System.Linq;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET LOCATIONS BY GAME ID
        [HttpGet("{gameId}")]
        public IActionResult GetLocations(int gameId)
        {
            var locations = _context.Locations
                .Where(l => l.GameId == gameId)
                .ToList();

            return Ok(locations);
        }
    }
}
