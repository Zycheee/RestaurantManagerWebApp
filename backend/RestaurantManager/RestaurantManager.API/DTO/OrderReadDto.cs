namespace RestaurantManager.API.DTO
{
    public class OrderReadDto
    {
        public int Id { get; set; }
        public int TableNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemReadDto> OrderItems { get; set; } = new();
    }
}
