using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using GameBookingAPI.Models;
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

        // GET FOOD BY ID
        [HttpGet("{id}")]
        public IActionResult GetFood(int id)
        {
            var food = _context.Foods.Find(id);
            if (food == null)
                return NotFound("Food not found");
            return Ok(food);
        }

        // CREATE FOOD
        [HttpPost]
        public IActionResult CreateFood([FromBody] Food food)
        {
            if (food == null)
                return BadRequest("Invalid food data");

            if (string.IsNullOrWhiteSpace(food.FoodName))
                return BadRequest("Food name is required");

            _context.Foods.Add(food);
            _context.SaveChanges();

            return Ok(new { message = "Food created successfully", foodId = food.FoodId });
        }

        // UPDATE FOOD
        [HttpPut("{id}")]
        public IActionResult UpdateFood(int id, [FromBody] Food updatedFood)
        {
            var food = _context.Foods.Find(id);
            if (food == null)
                return NotFound("Food not found");

            if (string.IsNullOrWhiteSpace(updatedFood.FoodName))
                return BadRequest("Food name is required");

            food.FoodName = updatedFood.FoodName;
            food.Price = updatedFood.Price;

            _context.SaveChanges();

            return Ok(new { message = "Food updated successfully" });
        }

        // DELETE FOOD
        [HttpDelete("{id}")]
        public IActionResult DeleteFood(int id)
        {
            var food = _context.Foods.Find(id);
            if (food == null)
                return NotFound("Food not found");

            _context.Foods.Remove(food);
            _context.SaveChanges();

            return Ok(new { message = "Food deleted successfully" });
        }
    }
}
