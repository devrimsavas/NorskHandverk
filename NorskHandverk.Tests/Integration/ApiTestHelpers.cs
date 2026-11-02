using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace NorskHandverk.Tests.Integration;

public static class ApiTestHelpers
{
    public record LoginResult(string Token, int CustomerId, string Name, string Role);

    public static async Task<LoginResult> LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/Auth/login", new { email, password });
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<LoginResult>())!;
    }

    // Registers a new customer with a unique email and logs in as them
    public static async Task<LoginResult> RegisterAndLoginCustomerAsync(HttpClient client)
    {
        var email = $"customer-{Guid.NewGuid():N}@test.local";
        const string password = "Customer123";

        var response = await client.PostAsJsonAsync("/api/Customer", new
        {
            name = "Test",
            surname = "Customer",
            email,
            password,
            address = "Storgata 1, Drammen",
            telephoneNumber = "40000000",
        });
        response.EnsureSuccessStatusCode();

        return await LoginAsync(client, email, password);
    }

    public static void UseToken(this HttpClient client, string token)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    // Logs in as the seeded admin on a new client
    public static async Task<HttpClient> CreateAdminClientAsync(NorskHandverkApiFactory factory)
    {
        var client = factory.CreateClient();
        var admin = await LoginAsync(client, NorskHandverkApiFactory.AdminEmail, NorskHandverkApiFactory.AdminPassword);
        client.UseToken(admin.Token);
        return client;
    }

    // Creates a category, a brand and a product as admin, returns the product id
    public static async Task<int> CreateProductAsync(HttpClient adminClient, decimal price, int quantity, decimal vatRate = 0.25m)
    {
        var unique = Guid.NewGuid().ToString("N")[..8];

        var categoryResponse = await adminClient.PostAsJsonAsync("/api/Category", new
        {
            name = $"Category {unique}",
            description = "Test category",
            defaultVatRate = vatRate,
        });
        categoryResponse.EnsureSuccessStatusCode();
        var category = await categoryResponse.Content.ReadFromJsonAsync<IdOnly>();

        var brandResponse = await adminClient.PostAsJsonAsync("/api/Brand", new { name = $"Brand {unique}" });
        brandResponse.EnsureSuccessStatusCode();
        var brand = await brandResponse.Content.ReadFromJsonAsync<IdOnly>();

        var productResponse = await adminClient.PostAsJsonAsync("/api/Product", new
        {
            title = $"Product {unique}",
            description = "Test product",
            price,
            discount = 0,
            quantity,
            categoryId = category!.Id,
            brandId = brand!.Id,
        });
        productResponse.EnsureSuccessStatusCode();
        var product = await productResponse.Content.ReadFromJsonAsync<IdOnly>();

        return product!.Id;
    }

    public record IdOnly(int Id);


}