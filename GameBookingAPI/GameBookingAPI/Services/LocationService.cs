using System.Text.Json;

namespace GameBookingAPI.Services
{
    public class LocationService
    {
        private readonly HttpClient _httpClient;

        public LocationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> IsAllowedLocation(string ip)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://ipapi.co/{ip}/json/");
                var json = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(json);
                var city = doc.RootElement.GetProperty("city").GetString()?.ToLower();

                return city == "patna" || city == "aligarh";
            }
            catch
            {
                return false;
            }
        }
    }
}
