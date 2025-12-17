
namespace RestaurantManager.API.DTO
{
    public class CreateOrderItemDto
    {
        public int OrderId { get; set; }
        public int FoodId { get; set; }
        public int Quantity { get; set; }
    }
}
