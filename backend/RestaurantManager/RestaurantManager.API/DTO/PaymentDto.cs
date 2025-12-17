namespace RestaurantManager.API.DTO
{
    public class PaymentDto
    {
        public string PaymentMethod { get; set; } // "Cash", "Card", etc.
        public decimal AmountPaid { get; set; }   // e.g. 500.00
    }
}