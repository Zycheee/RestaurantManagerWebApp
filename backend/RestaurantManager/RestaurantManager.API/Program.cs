using Microsoft.EntityFrameworkCore;
using RestaurantManager.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer(); // Ensure Swagger works
builder.Services.AddSwaggerGen(); // Ensure Swagger works

builder.Services.AddDbContext<AppDbContext>(options => options
    .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ADD CORS
builder.Services.AddCors(options =>
{
    // We define ONE policy called "AllowAll" that lets everyone in (PC and Phone)
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()  // Important for Phone connection
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// === FIX IS HERE: Comment out HttpsRedirection ===
// app.UseHttpsRedirection(); 

app.UseStaticFiles(); // Allows images to load

// Apply the CORS policy we defined above
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();