using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NorskHandverk.Models;
using NorskHandverk.Services;

namespace NorskHandverk.Tests.Integration;

[Collection("Api")]
public class AbandonedCartTests
{
    private readonly NorskHandverkApiFactory _factory;

    public AbandonedCartTests(NorskHandverkApiFactory factory)
    {
        _factory = factory;
    }

    private record CartDto(int Id);
    private record ProductDto(int Id, int Quantity);

    // A customer with 4 items of a new product (stock 10) in an active cart
    private async Task<(HttpClient Client, int CartId, int ProductId)> CustomerWithCartAsync()
    {
        var admin = await ApiTestHelpers.CreateAdminClientAsync(_factory);
        var productId = await ApiTestHelpers.CreateProductAsync(admin, price: 200m, quantity: 10);

        var client = _factory.CreateClient();
        var customer = await ApiTestHelpers.RegisterAndLoginCustomerAsync(client);
        client.UseToken(customer.Token);

        var add = await client.PostAsJsonAsync("/api/Cart", new { cartItem = new { productId, quantity = 4 } });
        add.EnsureSuccessStatusCode();

        var cart = await client.GetFromJsonAsync<CartDto>("/api/Cart/me");
        return (client, cart!.Id, productId);
    }

    private async Task<int> ReleaseAbandonedCartsAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<AbandonedCartService>();
        return await service.ReleaseAbandonedCartsAsync();
    }

    [Fact]
    public async Task ReleaseAbandonedCarts_OldCart_IsAbandonedAndStockIsReturned()
    {
        var (client, cartId, productId) = await CustomerWithCartAsync();

        // Pretend the cart was last changed two days ago
        using (var scope = _factory.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.Carts
                .Where(c => c.Id == cartId)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.UpdatedAt, DateTime.UtcNow.AddDays(-2)));
        }

        var released = await ReleaseAbandonedCartsAsync();

        Assert.True(released >= 1);

        // The customer no longer has an active cart
        var cartResponse = await client.GetAsync("/api/Cart/me");
        Assert.Equal(HttpStatusCode.NotFound, cartResponse.StatusCode);

        // The 4 reserved items are back in stock
        var product = await client.GetFromJsonAsync<ProductDto>($"/api/Product/{productId}");
        Assert.Equal(10, product!.Quantity);
    }

    [Fact]
    public async Task ReleaseAbandonedCarts_RecentCart_IsLeftAlone()
    {
        var (client, _, productId) = await CustomerWithCartAsync();

        await ReleaseAbandonedCartsAsync();

        var cartResponse = await client.GetAsync("/api/Cart/me");
        Assert.Equal(HttpStatusCode.OK, cartResponse.StatusCode);

        var product = await client.GetFromJsonAsync<ProductDto>($"/api/Product/{productId}");
        Assert.Equal(6, product!.Quantity);
    }
}