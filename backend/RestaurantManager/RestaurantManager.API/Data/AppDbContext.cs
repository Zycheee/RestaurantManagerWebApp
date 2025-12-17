using Microsoft.EntityFrameworkCore;
using RestaurantManager.Api.Models;

namespace RestaurantManager.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Food> Foods { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<FoodCategory> FoodCategories { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionItem> TransactionItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FoodCategory>().HasData(
                new FoodCategory { Id = 1, Name = "Breakfast" },
                new FoodCategory { Id = 2, Name = "Lunch" },
                new FoodCategory { Id = 3, Name = "Dinner" }
            );
        }


    }
}
