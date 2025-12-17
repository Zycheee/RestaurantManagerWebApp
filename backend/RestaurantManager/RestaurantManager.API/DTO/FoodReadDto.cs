using RestaurantManager.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace RestaurantManager.API.DTO
{
    public class FoodReadDto
    {
        public int Id { get; set; }  // ✅ Add this
        public string Name { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public FoodStatus Status { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
    }

}
