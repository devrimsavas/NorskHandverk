using System.Net;
using System.Net.Http.Json;

namespace NorskHandverk.Tests.Integration;

[Collection("Api")]
public class AuthApiTests
{
    private readonly NorskHandverkApiFactory _factory;

    public AuthApiTests(NorskHandverkApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_AsSeededAdmin_ReturnsAdminToken()
    {
        var client = _factory.CreateClient();

        var result = await ApiTestHelpers.LoginAsync(client, NorskHandverkApiFactory.AdminEmail, NorskHandverkApiFactory.AdminPassword);

        Assert.False(string.IsNullOrEmpty(result.Token));
        Assert.Equal("Admin", result.Role);
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/Auth/login", new
        {
            email = NorskHandverkApiFactory.AdminEmail,
            password = "wrong-password",
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyProfile_WithoutToken_Returns401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/Customer/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ListCustomers_AsCustomer_Returns403()
    {
        var client = _factory.CreateClient();
        var customer = await ApiTestHelpers.RegisterAndLoginCustomerAsync(client);
        client.UseToken(customer.Token);

        var response = await client.GetAsync("/api/Customer");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}