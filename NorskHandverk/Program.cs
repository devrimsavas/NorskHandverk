using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using NorskHandverk.Models;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.Services;

//stripe 
using Stripe;




var builder = WebApplication.CreateBuilder(args);
//get stripe key
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
builder.Services.AddScoped<IPaymentService, StripeService>();
builder.Services.AddScoped<IOrderService, OrderService>();


builder.Services.AddCors(options =>
{ options.AddPolicy("AllowAll", policy =>
{
    policy.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin();
});

});

// db context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add services to the container.

builder.Services.AddControllers();
//Add AutoMap
builder.Services.AddAutoMapper(typeof(Program));


builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title="Norwegian Handverk Handle System",
        Version="v1",
        Description="Handverk Shopping Management V1"
    }
        );

});

var app = builder.Build();
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
