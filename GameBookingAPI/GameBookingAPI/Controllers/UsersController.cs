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
        public IActionResult Register(User user)
        {
            // Eligibility Logic
            if (user.IsGpsEnabled)
            {
                if (user.DetectedCity == "Patna" || user.DetectedCity == "Aligarh")
                    user.IsEligible = true;
                else
                    user.IsEligible = false;
            }
            else
            {
                if (user.SelectedCity == "Patna" || user.SelectedCity == "Aligarh")
                    user.IsEligible = true;
                else
                    user.IsEligible = false;
            }

            user.IsVerified = false; // OTP verification later

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                Message = "User registered successfully",
                Eligible = user.IsEligible
            });
        }


        // ================= LOGIN USER =================
        [HttpPost("login")]
        public IActionResult Login(string email, string password)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == email && u.Password == password);

            if (user == null)
            {
                return Unauthorized("Invalid email or password");
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
}
