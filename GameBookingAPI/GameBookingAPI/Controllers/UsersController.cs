using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using GameBookingAPI.Models;
using System.Linq;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // ================= REGISTER USER =================
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            // Basic validation
            if (string.IsNullOrEmpty(user.Email) ||
                string.IsNullOrEmpty(user.Password) ||
                string.IsNullOrEmpty(user.Name))
            {
                return BadRequest("All required fields must be filled.");
            }

            // Check if email already exists
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return BadRequest("Email already registered.");
            }

            // ================= Eligibility Logic =================
            if (user.IsGpsEnabled)
            {
                user.IsEligible = (user.DetectedCity == "Patna" || user.DetectedCity == "Aligarh");
            }
            else
            {
                user.IsEligible = (user.SelectedCity == "Patna" || user.SelectedCity == "Aligarh");
            }

            // Default values
            user.IsVerified = false;

            try
            {
                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok(new
                {
                    Message = "User registered successfully",
                    Eligible = user.IsEligible
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Database error: " + ex.Message);
            }
        }


        // ================= LOGIN USER =================
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest model)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok(new
            {
                Message = "Login successful",
                UserId = user.UserId,
                Name = user.Name,
                IsEligible = user.IsEligible
            });
        }
    }

    // DTO for Login
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
