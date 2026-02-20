using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace GameBookingAPI.Middlewares
{
    public class CityRestrictionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHttpClientFactory _httpClientFactory;

        // 🔐 Allowed PUBLIC IPs
        private static readonly HashSet<string> AllowedIps =
            new HashSet<string>
            {
                "152.57.92.6",
                "183.82.33.7",
                "121.242.155.146",
                "182.79.24.74"
            };

        public CityRestrictionMiddleware(
            RequestDelegate next,
            IHttpClientFactory httpClientFactory)
        {
            _next = next;
            _httpClientFactory = httpClientFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();

                // ✅ Get current PUBLIC IP
                var response = await client.GetStringAsync("https://api.ipify.org?format=json");

                var ipData = JsonSerializer.Deserialize<IpResponse>(response);
                var publicIp = ipData?.ip;

                Console.WriteLine($"Public IP Detected: {publicIp}");

                if (string.IsNullOrEmpty(publicIp) || !AllowedIps.Contains(publicIp))
                {
                    await BlockRequest(context, $"Access denied. Your Public IP: {publicIp}");
                    return;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                await BlockRequest(context, "IP verification failed.");
                return;
            }

            await _next(context);
        }

        private static async Task BlockRequest(HttpContext context, string message)
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";

            var result = new
            {
                success = false,
                message = message
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(result)
            );
        }

        private class IpResponse
        {
            public string ip { get; set; }
        }
    }
}
