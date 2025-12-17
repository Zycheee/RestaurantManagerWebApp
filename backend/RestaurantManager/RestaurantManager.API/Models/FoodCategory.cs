namespace RestaurantManager.Api.Models
{
    public class FoodCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation property: foods under this category
        public List<Food> Foods { get; set; } = new();
    }
}
