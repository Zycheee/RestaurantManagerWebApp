public class FoodCreateDto
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public int Status { get; set; }
    public int CategoryId { get; set; }

    // This receives the file from React
    public IFormFile? ImageFile { get; set; }
}