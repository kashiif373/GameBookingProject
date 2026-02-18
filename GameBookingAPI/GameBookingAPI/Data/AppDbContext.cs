using Microsoft.EntityFrameworkCore;
using GameBookingAPI.Models;

namespace GameBookingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingFood> BookingFoods { get; set; }

    }
}
