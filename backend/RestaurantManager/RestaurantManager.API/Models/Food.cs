
namespace RestaurantManager.Api.Models
{
    public class Food
    {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public FoodStatus Status { get; set; }

        // NEW
        public int CategoryId { get; set; }   // foreign key
        public FoodCategory Category { get; set; } = null!;
    }

    // Defines the allowed values for food availability
    public enum FoodStatus
    {
        Available = 1,    // Food can be ordered
        OutOfStock = 2    // Food cannot be ordered
    }
}
