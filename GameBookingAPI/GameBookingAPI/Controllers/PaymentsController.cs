using Microsoft.AspNetCore.Mvc;
using GameBookingAPI.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace GameBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public PaymentsController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        // ==============================
        // CREATE RAZORPAY ORDER
        // ==============================
        [HttpPost("create-order/{bookingId}")]
        public async Task<IActionResult> CreateOrder(int bookingId)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == bookingId);

            if (booking == null)
                return BadRequest(new { message = "Booking not found" });

            if (booking.PaymentStatus == "Paid")
                return BadRequest(new { message = "Booking already paid" });

            string keyId = _configuration["Razorpay:Key"];
            string keySecret = _configuration["Razorpay:Secret"];

            if (string.IsNullOrEmpty(keyId) || string.IsNullOrEmpty(keySecret))
                return BadRequest(new { message = "Razorpay keys not configured" });

            int amountInPaise = (int)(booking.TotalAmount * 100);

            var orderRequest = new
            {
                amount = amountInPaise,
                currency = "INR",
                receipt = $"booking_{bookingId}",
                payment_capture = 1
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.razorpay.com/v1/orders");
            request.Content = new StringContent(JsonSerializer.Serialize(orderRequest), Encoding.UTF8, "application/json");

            string credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{keyId}:{keySecret}"));
            request.Headers.Add("Authorization", $"Basic {credentials}");

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return BadRequest(new { message = "Order creation failed", error = responseContent });

            var json = JsonSerializer.Deserialize<JsonElement>(responseContent);
            string orderId = json.GetProperty("id").GetString();

            booking.RazorpayOrderId = orderId;
            _context.SaveChanges();

            // IMPORTANT: Return EXACT structure frontend expects
            return Ok(new
            {
                orderId = orderId,
                keyId = keyId,
                amount = amountInPaise,
                totalAmount = booking.TotalAmount
            });
        }

        // ==============================
        // VERIFY PAYMENT
        // ==============================
        [HttpPost("verify/{bookingId}")]
        public IActionResult VerifyPayment(int bookingId, [FromBody] PaymentVerificationModel model)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == bookingId);

            if (booking == null)
                return BadRequest(new { message = "Booking not found" });

            string keySecret = _configuration["Razorpay:Secret"];

            if (string.IsNullOrEmpty(keySecret))
                return BadRequest(new { message = "Razorpay secret not configured" });

            string payload = model.RazorpayOrderId + "|" + model.RazorpayPaymentId;
            string generatedSignature = GenerateSignature(payload, keySecret);

            if (generatedSignature == model.RazorpaySignature)
            {
                booking.PaymentStatus = "Paid";
                booking.RazorpayPaymentId = model.RazorpayPaymentId;
                _context.SaveChanges();

                return Ok(new { status = "Paid", message = "Payment successful" });
            }

            return BadRequest(new { message = "Invalid payment signature" });
        }

        // ==============================
        // GET PAYMENT STATUS
        // ==============================
        [HttpGet("{bookingId}")]
        public IActionResult GetPaymentStatus(int bookingId)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == bookingId);

            if (booking == null)
                return BadRequest(new { message = "Booking not found" });

            return Ok(new
            {
                bookingId = booking.BookingId,
                paymentStatus = booking.PaymentStatus,
                totalAmount = booking.TotalAmount
            });
        }

        // ==============================
        // SIGNATURE HELPER
        // ==============================
        private string GenerateSignature(string payload, string secret)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }

    public class PaymentVerificationModel
    {
        public string RazorpayOrderId { get; set; }
        public string RazorpayPaymentId { get; set; }
        public string RazorpaySignature { get; set; }
    }
}
