using System.ComponentModel.DataAnnotations;

namespace RestaurantManager.Api.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }
        public int TableNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending"; // Pending -> Cooking -> Ready -> Completed

        // --- NEW FIELDS FOR CASHIER (RECEIPT DATA) ---
        public string? PaymentMethod { get; set; } // e.g., "Cash", "Card", "GCash"
        public decimal? AmountPaid { get; set; }   // Amount the customer gave (e.g., 1000)
        public decimal? Change { get; set; }       // Change returned (e.g., 150.50)
        public DateTime? PaymentDate { get; set; } // Timestamp when paid

        public List<TransactionItem> TransactionItems { get; set; }
    }
}