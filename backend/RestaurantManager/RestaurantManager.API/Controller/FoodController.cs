using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManager.Api.Models; // Ensure this matches your Entity namespace
using RestaurantManager.API.Data;
using RestaurantManager.API.DTO;
using Microsoft.AspNetCore.Hosting; // Needed for file path

namespace RestaurantManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment; // helper to find wwwroot

        public FoodController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // ... GET Methods remain the same ...
        [HttpGet]
        public async Task<IActionResult> GetFoods([FromQuery] int? categoryId)
        {
            var query = _context.Foods.Include(f => f.Category).AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(f => f.CategoryId == categoryId.Value);
            }

            var foods = await query.AsNoTracking().ToListAsync();

            var result = foods.Select(f => new FoodReadDto
            {
                Id = f.Id,
                Name = f.Name,
                ImageUrl = f.ImageUrl,
                Quantity = f.Quantity,
                Price = f.Price,
                Status = f.Status,
                CategoryId = f.CategoryId,
                CategoryName = f.Category?.Name ?? "Unknown"
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFood(int id)
        {
            var food = await _context.Foods
                .Include(f => f.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id);

            if (food == null) return NotFound();

            var result = new FoodReadDto
            {
                Id = food.Id,
                Name = food.Name,
                ImageUrl = food.ImageUrl,
                Quantity = food.Quantity,
                Price = food.Price,
                Status = food.Status,
                CategoryId = food.CategoryId,
                CategoryName = food.Category?.Name
            };

            return Ok(result);
        }

        // ==========================
        // POST: api/food
        // ==========================
        [HttpPost]
        public async Task<IActionResult> CreateFood([FromForm] FoodCreateDto dto)
        {
            // 1. Validation
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = await _context.FoodCategories.FindAsync(dto.CategoryId);
            if (category == null) return BadRequest($"Category ID {dto.CategoryId} not found");

            // 2. Handle Image Upload
            string imageUrl = ""; // Default empty string

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                // Ensure wwwroot/images exists
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                // Create unique filename
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + dto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(fileStream);
                }

                // Set URL to relative path
                imageUrl = "/images/" + uniqueFileName;
            }

            // 3. Create Entity
            var food = new Food
            {
                Name = dto.Name,
                ImageUrl = imageUrl, // Use the generated path
                Quantity = dto.Quantity,
                Price = dto.Price,
                Status = (FoodStatus)dto.Status,
                CategoryId = dto.CategoryId
            };

            _context.Foods.Add(food);
            await _context.SaveChangesAsync();

            // 4. Return Result
            var result = new FoodReadDto
            {
                Id = food.Id,
                Name = food.Name,
                ImageUrl = food.ImageUrl,
                Quantity = food.Quantity,
                Price = food.Price,
                Status = food.Status,
                CategoryId = food.CategoryId,
                CategoryName = category.Name
            };

            return CreatedAtAction(nameof(GetFood), new { id = food.Id }, result);
        }

        // ==========================
        // PUT: api/food/{id}
        // ==========================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFood(int id, [FromForm] FoodUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            var food = await _context.Foods.FindAsync(id);
            if (food == null) return NotFound();

            // Verify Category
            var category = await _context.FoodCategories.FindAsync(dto.CategoryId);
            if (category == null) return BadRequest($"Category ID {dto.CategoryId} not found");

            // 1. Handle Image Logic (Only update if a new file is sent)
            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                // Optional: Delete old image if needed
                // if (!string.IsNullOrEmpty(food.ImageUrl)) { ... delete logic ... }

                // Replace this line:
                // var uploadsFolder = Path.Combine(_environment.WebRootPath, "images");

                // With this robust check:
                string webRootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
                var uploadsFolder = Path.Combine(webRootPath, "images"); if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + dto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(fileStream);
                }

                food.ImageUrl = "/images/" + uniqueFileName;
            }
            // else: keep the existing food.ImageUrl

            // 2. Update other fields
            food.Name = dto.Name;
            food.Quantity = dto.Quantity;
            food.Price = dto.Price;
            food.Status = (FoodStatus)dto.Status;
            food.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();

            // Return the updated object so frontend can update state immediately
            return Ok(new FoodReadDto
            {
                Id = food.Id,
                Name = food.Name,
                ImageUrl = food.ImageUrl,
                Quantity = food.Quantity,
                Price = food.Price,
                Status = food.Status,
                CategoryId = food.CategoryId,
                CategoryName = category.Name
            });
        }

        // ... DELETE remains the same ...
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFood(int id)
        {
            var food = await _context.Foods.FindAsync(id);
            if (food == null) return NotFound();

            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}