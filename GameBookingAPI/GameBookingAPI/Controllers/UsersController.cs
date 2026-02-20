using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using GameBookingAPI.Models;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UsersController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ================= REGISTER =================
    [HttpPost("register")]
public IActionResult Register([FromBody] User user)
{
    if (user == null)
    {
        return BadRequest(new
        {
            status = 400,
            success = false,
            message = "Invalid request data."
        });
    }

    if (string.IsNullOrWhiteSpace(user.Email) ||
        string.IsNullOrWhiteSpace(user.Password) ||
        string.IsNullOrWhiteSpace(user.Name))
    {
        return BadRequest(new
        {
            status = 400,
            success = false,
            message = "All required fields must be filled."
        });
    }

    var existingUser = _context.Users
                               .FirstOrDefault(u => u.Email == user.Email);

    if (existingUser != null)
    {
        return StatusCode(StatusCodes.Status409Conflict, new
        {
            status = 409,
            success = false,
            message = "Email ID already exists. Please use a different email."
        });
    }

    _context.Users.Add(user);
    _context.SaveChanges();

    return Ok(new
    {
        status = 200,
        success = true,
        message = "Registration successful."
    });
}



        // ================= LOGIN =================
        [HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest model)
{
    var user = _context.Users
        .FirstOrDefault(u => u.Email == model.Email);

    if (user == null)
    {
        return NotFound(new
        {
            success = false,
            message = "Email not found."
        });
    }

    if (user.Password != model.Password)
    {
        return Unauthorized(new
        {
            success = false,
            message = "Incorrect password."
        });
    }

    var token = GenerateJwtToken(user);

    return Ok(new
    {
        success = true,
        message = "Login successful.",
        token = token,
        name = user.Name,
        email = user.Email,
        userId = user.UserId.ToString()
    });
}


        // ================= LOGOUT =================
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // For JWT-based authentication, logout is handled on client side
            // by removing the token from localStorage/sessionStorage.
            // The server just returns a success message.
            return Ok(new { message = "Logout successful" });
        }

        // ================= TOKEN GENERATOR =================
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(_config["Jwt:DurationInMinutes"])
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // ================= LOGIN REQUEST MODEL =================
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
