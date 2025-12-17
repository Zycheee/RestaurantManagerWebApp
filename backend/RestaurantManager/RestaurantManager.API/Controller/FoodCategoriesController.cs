// Controllers/FoodCategoriesController.cs
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.API.Data;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class FoodCategoriesController : ControllerBase
{
    private readonly AppDbContext _context;
    public FoodCategoriesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.FoodCategories.AsNoTracking().ToListAsync();
        return Ok(categories);
    }
}
