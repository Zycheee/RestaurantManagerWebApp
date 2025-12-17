using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManager.Api.Models;
using RestaurantManager.API.Data;
using RestaurantManager.API.DTO;

namespace RestaurantManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/orderitems
        [HttpGet]
        public async Task<IActionResult> GetOrderItems()
        {
            var items = await _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Food)
                .AsNoTracking()
                .ToListAsync();

            var result = items.Select(oi => new OrderItemReadDto
            {
                Id = oi.Id,
                OrderId = oi.OrderId,
                FoodId = oi.FoodId,
                FoodName = oi.Food.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList();

            return Ok(result);
        }

        // GET: api/orderitems/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderItem(int id)
        {
            var item = await _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Food)
                .AsNoTracking()
                .FirstOrDefaultAsync(oi => oi.Id == id);

            if (item == null) return NotFound();

            var result = new OrderItemReadDto
            {
                Id = item.Id,
                OrderId = item.OrderId,
                FoodId = item.FoodId,
                FoodName = item.Food.Name,
                Quantity = item.Quantity,
                Price = item.Price
            };

            return Ok(result);
        }

        // POST: api/orderitems
        [HttpPost]
        public async Task<IActionResult> CreateOrderItem([FromBody] CreateOrderItemDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var order = await _context.Orders.FindAsync(dto.OrderId);
            if (order == null) return BadRequest($"Order ID {dto.OrderId} not found");

            var food = await _context.Foods.FindAsync(dto.FoodId);
            if (food == null) return BadRequest($"Food ID {dto.FoodId} not found");

            if (food.Status == FoodStatus.OutOfStock)
                return BadRequest($"Food '{food.Name}' is out of stock");

            if (food.Quantity < dto.Quantity)
                return BadRequest($"Not enough stock for '{food.Name}'");

            var orderItem = new OrderItem
            {
                OrderId = dto.OrderId,
                FoodId = dto.FoodId,
                Quantity = dto.Quantity,
                Price = food.Price
            };

            // Reduce stock
            food.Quantity -= dto.Quantity;

            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();

            var result = new OrderItemReadDto
            {
                Id = orderItem.Id,
                OrderId = orderItem.OrderId,
                FoodId = orderItem.FoodId,
                FoodName = food.Name,
                Quantity = orderItem.Quantity,
                Price = orderItem.Price
            };

            return CreatedAtAction(nameof(GetOrderItem), new { id = orderItem.Id }, result);
        }

        // PUT: api/orderitems/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderItem(int id, [FromBody] CreateOrderItemDto dto)
        {
            var existingItem = await _context.OrderItems.FindAsync(id);
            if (existingItem == null) return NotFound();

            var food = await _context.Foods.FindAsync(dto.FoodId);
            if (food == null) return BadRequest($"Food ID {dto.FoodId} not found");

            // Restore stock from old quantity
            var oldFood = await _context.Foods.FindAsync(existingItem.FoodId);
            if (oldFood != null) oldFood.Quantity += existingItem.Quantity;

            if (food.Quantity < dto.Quantity)
                return BadRequest($"Not enough stock for '{food.Name}'");

            existingItem.FoodId = dto.FoodId;
            existingItem.Quantity = dto.Quantity;
            existingItem.Price = food.Price;

            // Reduce stock
            food.Quantity -= dto.Quantity;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/orderitems/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            var item = await _context.OrderItems.FindAsync(id);
            if (item == null) return NotFound();

            // Restore stock
            var food = await _context.Foods.FindAsync(item.FoodId);
            if (food != null) food.Quantity += item.Quantity;

            _context.OrderItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
