using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using System.Linq;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FoodsController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL FOODS
        [HttpGet]
        public IActionResult GetFoods()
        {
            var foods = _context.Foods.ToList();
            return Ok(foods);
        }
    }
}
