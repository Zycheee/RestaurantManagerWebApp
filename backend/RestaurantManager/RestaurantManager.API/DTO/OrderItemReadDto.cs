namespace RestaurantManager.API.DTO
{
    public class OrderItemReadDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int FoodId { get; set; }
        public string FoodName { get; set; } // For display
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
