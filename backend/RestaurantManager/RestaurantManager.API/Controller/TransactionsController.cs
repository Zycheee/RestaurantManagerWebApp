using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManager.Api.Models; // Ensure this matches your actual namespace
using RestaurantManager.API.Data;
using RestaurantManager.API.DTO;

namespace RestaurantManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/transactions
        // Fetches all orders (Kitchen needs this to see what to cook)
        [HttpGet]
        public async Task<IActionResult> GetTransactions()
        {
            var transactions = await _context.Transactions
                .Include(t => t.TransactionItems)
                    .ThenInclude(ti => ti.Food) // Include Food details (Name)
                .OrderByDescending(t => t.OrderDate) // Newest first
                .ToListAsync();

            return Ok(transactions);
        }

        // POST: api/Transactions
        // This handles the Order Submission AND Inventory Deduction
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            Console.WriteLine($"[New Order] Received request for Table {transaction.TableNumber}");

            if (transaction == null || transaction.TransactionItems == null || !transaction.TransactionItems.Any())
            {
                Console.WriteLine("[Error] Transaction is empty or has no items.");
                return BadRequest("Order cannot be empty.");
            }

            // Ensure defaults are set
            transaction.Status = "Pending";
            transaction.OrderDate = DateTime.Now;

            // 1. Loop through the items to Update Stock
            foreach (var item in transaction.TransactionItems)
            {
                // Find the specific food item in the database
                var foodInDb = await _context.Foods.FindAsync(item.FoodId);

                if (foodInDb == null)
                {
                    Console.WriteLine($"[Error] Food ID {item.FoodId} not found in DB.");
                    return BadRequest($"Food item with ID {item.FoodId} not found.");
                }

                Console.WriteLine($"[Check] '{foodInDb.Name}' - Stock: {foodInDb.Quantity}, Requested: {item.Quantity}");

                // Check if there is enough stock
                if (foodInDb.Quantity < item.Quantity)
                {
                    Console.WriteLine($"[Fail] Not enough stock for '{foodInDb.Name}'");
                    return BadRequest($"Not enough stock for '{foodInDb.Name}'. Available: {foodInDb.Quantity}");
                }

                // DEDUCT THE QUANTITY
                foodInDb.Quantity -= item.Quantity;
                Console.WriteLine($"[Success] Deducted. New Stock: {foodInDb.Quantity}");

                // Optional: If quantity hits 0, automatically mark as Out of Stock
                if (foodInDb.Quantity == 0)
                {
                    foodInDb.Status = 0; // Assuming 0 = Unavailable
                }
            }

            // 2. Save the Transaction and the Updated Food Quantities
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            Console.WriteLine("[Success] Transaction Saved.");
            return CreatedAtAction("GetTransactions", new { id = transaction.Id }, transaction);
        }

        // PUT: api/transactions/{id}/status
        // (Kitchen uses this to mark order as "Ready" or "Completed")
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();

            transaction.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated" });
        }

        // PUT: api/transactions/{id}/pay
        // Cashier calls this when clicking "Pay" or "Print Receipt"
        [HttpPut("{id}/pay")]
        public async Task<IActionResult> ProcessPayment(int id, [FromBody] PaymentDto payment)
        {
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null) return NotFound("Order not found");

            // Note: In your frontend, you are calculating VAT on top of the DB total.
            // Ensure you are validating against the correct amount if needed.
            // For now, we allow payment as long as it covers the base DB amount.
            if (payment.AmountPaid < transaction.TotalAmount)
            {
                return BadRequest("Insufficient payment amount.");
            }

            // 1. Update Payment Details
            transaction.PaymentMethod = payment.PaymentMethod;
            transaction.AmountPaid = payment.AmountPaid;
            // Recalculate change based on DB total (or pass exact change from frontend if logic differs)
            transaction.Change = payment.AmountPaid - transaction.TotalAmount;
            transaction.PaymentDate = DateTime.Now;

            // 2. Mark as Completed (This "closes" the receipt)
            transaction.Status = "Completed";

            await _context.SaveChangesAsync();

            // 3. Return the calculated change so Frontend can show it
            return Ok(new
            {
                message = "Payment Successful",
                change = transaction.Change,
                receiptId = transaction.Id
            });
        }
    }
}