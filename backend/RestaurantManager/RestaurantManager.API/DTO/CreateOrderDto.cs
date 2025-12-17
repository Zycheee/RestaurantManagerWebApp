using RestaurantManager.API.DTO;
using System.ComponentModel.DataAnnotations;

public class CreateOrderDto
{
    public int TableNumber { get; set; }
    public List<CreateOrderItemDto> OrderItems { get; set; } = new();
}