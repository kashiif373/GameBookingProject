using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using GameBookingAPI.Models;
using GameBookingAPI.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;

        public UsersController(AppDbContext context, IConfiguration config, EmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
                return Conflict(new { message = "Email already exists." });

            user.Role = "User";
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // ===== BEAUTIFUL WELCOME EMAIL =====
            string body = $@"
<div style='font-family:Segoe UI,Arial; background:#f4f6f8; padding:30px'>
  <div style='max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.1)'>

    <div style='background:linear-gradient(135deg,#00c6ff,#0072ff); padding:20px; text-align:center; color:white'>
      <h1 style='margin:0'>🎮 Welcome to Playeato</h1>
      <p style='margin:5px 0'>Your Gaming Journey Starts Here!</p>
    </div>

    <div style='padding:30px'>
      <h2>Hello {user.Name}, 👋</h2>

      <p style='font-size:16px; color:#444'>
        We are thrilled to have you join <b>Playeato</b> — your one-stop destination for booking exciting games.
      </p>

      <p style='font-size:16px; color:#444'>
        Your account has been successfully created. Start exploring games and book your favorite slots now!
      </p>

      <div style='text-align:center; margin:30px 0'>
        <a style='background:#0072ff; color:white; padding:12px 25px; text-decoration:none; border-radius:8px; font-weight:bold'>
          Start Booking Now
        </a>
      </div>

      <p style='font-size:14px; color:#777'>
        Happy Gaming! 🎮 <br> — Team Playeato
      </p>
    </div>

    <div style='background:#f4f6f8; padding:15px; text-align:center; font-size:13px; color:#666'>
      © {DateTime.Now.Year} Playeato — All Rights Reserved
    </div>

  </div>
</div>";

            await _emailService.SendEmailAsync(user.Email, "Welcome to Playeato 🎮", body);

            return Ok(new { message = "Registration successful." });
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
                return NotFound(new { message = "Email not found." });

            if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
                return Unauthorized(new { message = "Incorrect password." });

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                name = user.Name,
                email = user.Email,
                role = user.Role
            });
        }
        // public IActionResult Login([FromBody] LoginRequest model)
        // {
        //     var user = _context.Users
        //         .FirstOrDefault(u => u.Email == model.Email);
 
        //     if (user == null)
        //     {
        //         return NotFound(new
        //         {
        //             success = false,
        //             message = "Email not found."
        //         });
        //     }
 
        //     if (user.Password != model.Password)
        //     {
        //         return Unauthorized(new
        //         {
        //             success = false,
        //             message = "Incorrect password."
        //         });
        //     }
 
        //     var token = GenerateJwtToken(user);
 
        //     return Ok(new
        //     {
        //         success = true,
        //         message = "Login successful.",
        //         token = token,
        //         name = user.Name,
        //         email = user.Email,
        //         role = user.Role,     // ⭐ send role to frontend
        //         userId = user.UserId.ToString()
        //     });
        // }

        // ================= SEND OTP =================
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] EmailDto model)
        {
            if (string.IsNullOrEmpty(model.Email))
                return BadRequest(new { message = "Email is required." });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
                return Ok(new { message = "If email exists, OTP sent." });

            var otp = new Random().Next(100000, 999999).ToString();

            user.ResetOTP = otp;
            user.OTPExpiry = DateTime.Now.AddMinutes(5);

            await _context.SaveChangesAsync();

            // ===== BEAUTIFUL OTP EMAIL =====
            string body = $@"
<div style='font-family:Segoe UI,Arial; background:#f4f6f8; padding:30px'>
  <div style='max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.1)'>

    <div style='background:linear-gradient(135deg,#ff512f,#dd2476); padding:20px; text-align:center; color:white'>
      <h1 style='margin:0'>🔐 Password Reset</h1>
      <p style='margin:5px 0'>Playeato Security Verification</p>
    </div>

    <div style='padding:30px; text-align:center'>
      <h2>Hello Gamer 👋</h2>

      <p style='font-size:16px; color:#444'>
        You requested to reset your password. Use the OTP below to continue.
      </p>

      <div style='margin:30px 0; font-size:36px; font-weight:bold; letter-spacing:6px; color:#dd2476'>
        {otp}
      </div>

      <p style='font-size:14px; color:#777'>
        This OTP is valid for <b>5 minutes</b>.
      </p>

      <p style='font-size:14px; color:#999'>
        If you did not request this, please ignore this email.
      </p>
    </div>

    <div style='background:#f4f6f8; padding:15px; text-align:center; font-size:13px; color:#666'>
      © {DateTime.Now.Year} Playeato — Secure Gaming Platform
    </div>

  </div>
</div>";

            await _emailService.SendEmailAsync(model.Email, "Playeato OTP Verification 🔐", body);

            return Ok(new { message = "OTP sent to email." });
        }

        // ================= VERIFY OTP =================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] ResetOtpDto model)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == model.Email &&
                    u.ResetOTP == model.OTP &&
                    u.OTPExpiry > DateTime.Now);

            if (user == null)
                return BadRequest(new { message = "Invalid or expired OTP." });

            user.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            user.ResetOTP = null;
            user.OTPExpiry = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful." });
        }

        // ================= JWT =================
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:DurationInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // ================= DTOs =================
    public class EmailDto { public string Email { get; set; } }
    public class ResetOtpDto { public string Email { get; set; } public string OTP { get; set; } public string NewPassword { get; set; } }
    public class LoginRequest { public string Email { get; set; } public string Password { get; set; } }
}