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
}