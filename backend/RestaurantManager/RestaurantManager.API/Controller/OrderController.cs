using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManager.Api.Models;
using RestaurantManager.API.Data;

namespace RestaurantManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================
        // GET: api/orders
        // Returns all orders (for Kitchen or Cashier view)
        // ==========================
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems) // Include food items
                    .ThenInclude(oi => oi.Food)
                .AsNoTracking()
                .ToListAsync();

            return Ok(orders);
        }

        // ==========================
        // GET: api/orders/{id}
        // Returns a single order by ID
        // ==========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Food)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        // ==========================
        // POST: api/orders
        // Create a new order (Waiter submits)
        // ==========================
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Calculate price for each OrderItem from Food table
            foreach (var item in order.OrderItems)
            {
                var food = await _context.Foods.FindAsync(item.FoodId);
                if (food == null)
                    return BadRequest($"Food ID {item.FoodId} not found");

                if (food.Status == FoodStatus.OutOfStock)
                    return BadRequest($"Food '{food.Name}' is out of stock");

                item.Price = food.Price; // Save price at order time
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // ==========================
        // DELETE: api/orders/{id}
        // Cancel an order
        // ==========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            _context.OrderItems.RemoveRange(order.OrderItems);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
