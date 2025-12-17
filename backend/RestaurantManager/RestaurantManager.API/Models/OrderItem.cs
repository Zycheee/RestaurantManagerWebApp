using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace RestaurantManager.Api.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ValidateNever]          // ⬅ STOP validation
        [JsonIgnore]             // ⬅ STOP JSON binding
        public Order Order { get; set; } = null!;

        [Required]
        public int FoodId { get; set; }

        [ValidateNever]          // ⬅ STOP validation
        [JsonIgnore]             // ⬅ STOP JSON binding
        public Food Food { get; set; } = null!;

        [Required]
        public int Quantity { get; set; }

        public decimal Price { get; set; }
    }
}
