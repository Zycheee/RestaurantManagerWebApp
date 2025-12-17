using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManager.Api.Models;
using RestaurantManager.API.Data;
using RestaurantManager.API.DTO;
// Add your DTO namespace here

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

        // POST: api/transactions
        // (This is what your Waiter uses to submit orders)
        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] Transaction transaction)
        {
            if (transaction == null) return BadRequest();

            // Ensure status is set
            transaction.Status = "Pending";
            transaction.OrderDate = DateTime.Now;

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(transaction);
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

            if (payment.AmountPaid < transaction.TotalAmount)
            {
                return BadRequest("Insufficient payment amount.");
            }

            // 1. Update Payment Details
            transaction.PaymentMethod = payment.PaymentMethod;
            transaction.AmountPaid = payment.AmountPaid;
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