namespace RestaurantManager.Api.Models
{
    // Represents a customer's order made by the Waiter
    public class Order
    {
        // Primary key of the order
        public int Id { get; set; }

        // Table number where the order will be served
        public int TableNumber { get; set; }

        // Date and time when the order was created
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // List of food items included in this order
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
