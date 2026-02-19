using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System.Globalization;
using System.Net;
using System.Text;
using System.Text.Json;

namespace GameBookingAPI.Middlewares
{
    public class CityRestrictionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;
        private readonly IHttpClientFactory _httpClientFactory;

        private static readonly HashSet<string> AllowedCities =
            new HashSet<string> { "chennai", "patna", "aligarh" };

        public CityRestrictionMiddleware(
            RequestDelegate next,
            IMemoryCache cache,
            IHttpClientFactory httpClientFactory)
        {
            _next = next;
            _cache = cache;
            _httpClientFactory = httpClientFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var ipAddress = GetClientIp(context);

            if (string.IsNullOrEmpty(ipAddress))
            {
                await BlockRequest(context, "Unable to detect IP.");
                return;
            }

            Console.WriteLine($"Detected IP: {ipAddress}");

            // Allow localhost (for development)
            if (ipAddress == "127.0.0.1" || ipAddress == "::1")
            {
                await _next(context);
                return;
            }

            try
            {
                if (!_cache.TryGetValue(ipAddress, out string city))
                {
                    var client = _httpClientFactory.CreateClient();

                    var response = await client.GetStringAsync(
                        $"https://ipinfo.io/{ipAddress}/json"
                    );

                    var geoData = JsonSerializer.Deserialize<IpResponse>(response);

                    city = NormalizeCity(geoData?.city ?? "");

                    _cache.Set(ipAddress, city, TimeSpan.FromMinutes(30));
                }

                Console.WriteLine($"Detected City: {city}");

                if (!AllowedCities.Contains(city))
                {
                    await BlockRequest(context,
                        $"Access denied. Your city: {city}");
                    return;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                await BlockRequest(context, "Location verification failed.");
                return;
            }

            await _next(context);
        }

        private static async Task BlockRequest(HttpContext context, string message)
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync(message);
        }

        private static string GetClientIp(HttpContext context)
        {
            // 1️⃣ First check X-Forwarded-For
            var forwarded = context.Request.Headers["X-Forwarded-For"]
                                   .FirstOrDefault();

            if (!string.IsNullOrEmpty(forwarded))
                return forwarded.Split(',')[0].Trim();

            // 2️⃣ Otherwise use remote IP
            return context.Connection.RemoteIpAddress?.ToString();
        }

        private static string NormalizeCity(string text)
        {
            if (string.IsNullOrEmpty(text))
                return "";

            var normalized = text.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();

            foreach (var c in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c)
                    != UnicodeCategory.NonSpacingMark)
                    sb.Append(c);
            }

            return sb.ToString()
                     .Normalize(NormalizationForm.FormC)
                     .Trim()
                     .ToLower();
        }

        private class IpResponse
        {
            public string city { get; set; }
        }
    }
}
