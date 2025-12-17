using System.ComponentModel.DataAnnotations;

namespace RestaurantManager.API.DTO
{
    public class FoodUpdateDto : FoodCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
}
