using System;
using System.Collections.Generic;

namespace GameBookingAPI.Models
{
    public class BookingHistoryDTO
    {
        public int BookingId { get; set; }
        public string GameName { get; set; }
        public string LocationName { get; set; }
        public DateTime BookingDate { get; set; }
        public string TimeSlot { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; }
        public string PaymentMethod { get; set; }


        public List<FoodDTO> Foods { get; set; }
    }

    public class FoodDTO
    {
        public string FoodName { get; set; }
        public int Quantity { get; set; }
    }
}
