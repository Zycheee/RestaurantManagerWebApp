using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RestaurantManager.Api.Models
{
    public class TransactionItem
    {
        [Key]
        public int Id { get; set; }

        public int TransactionId { get; set; }
        [JsonIgnore] // Prevent cycles when serializing back to JSON
        public Transaction? Transaction { get; set; }

        public int FoodId { get; set; }
        public Food? Food { get; set; } // So we can get the Food Name later

        public int Quantity { get; set; }
        public decimal Price { get; set; } // Snapshot of price at time of order
    }
}