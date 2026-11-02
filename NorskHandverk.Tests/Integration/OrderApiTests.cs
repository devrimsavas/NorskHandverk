using System.Net;
using System.Net.Http.Json;

namespace NorskHandverk.Tests.Integration;

[Collection("Api")]
public class OrderApiTests
{
    private readonly NorskHandverkApiFactory _factory;

    public OrderApiTests(NorskHandverkApiFactory factory)
    {
        _factory = factory;
    }

    private record OrderDto(int Id, string StatusName, int CustomerId, decimal TotalPriceIncVat);
    private record CheckoutResult(OrderDto Order, string ClientSecret);
    private record ProductDto(int Id, int Quantity);

    // The fake builds client secrets as "{intentId}_secret_test"
    private static string IntentIdFrom(string clientSecret) => clientSecret.Split("_secret_")[0];

    private async Task<(HttpClient Client, CheckoutResult Checkout, int ProductId)> CustomerWithCheckoutAsync(int quantity)
    {
        var admin = await ApiTestHelpers.CreateAdminClientAsync(_factory);
        var productId = await ApiTestHelpers.CreateProductAsync(admin, price: 400m, quantity: 10);

        var client = _factory.CreateClient();
        var customer = await ApiTestHelpers.RegisterAndLoginCustomerAsync(client);
        client.UseToken(customer.Token);

        var addResponse = await client.PostAsJsonAsync("/api/Cart", new { cartItem = new { productId, quantity } });
        addResponse.EnsureSuccessStatusCode();

        var checkoutResponse = await client.PostAsync("/api/Order/checkout", null);
        checkoutResponse.EnsureSuccessStatusCode();
        var checkout = (await checkoutResponse.Content.ReadFromJsonAsync<CheckoutResult>())!;

        return (client, checkout, productId);
    }

    [Fact]
    public async Task Checkout_CalculatesTotalOnTheServer()
    {
        var (_, checkout, _) = await CustomerWithCheckoutAsync(quantity: 2);

        // 2 x 400 kr + 25% VAT
        Assert.Equal(1000m, checkout.Order.TotalPriceIncVat);
        Assert.Equal("Awaiting Payment", checkout.Order.StatusName);
    }

    [Fact]
    public async Task GetOrder_OfAnotherCustomer_Returns404()
    {
        var (_, checkout, _) = await CustomerWithCheckoutAsync(quantity: 1);

        var otherClient = _factory.CreateClient();
        var other = await ApiTestHelpers.RegisterAndLoginCustomerAsync(otherClient);
        otherClient.UseToken(other.Token);

        var response = await otherClient.GetAsync($"/api/Order/{checkout.Order.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CancelOrder_Unpaid_CancelsPaymentIntentAndReturnsStock()
    {
        var (client, checkout, productId) = await CustomerWithCheckoutAsync(quantity: 3);

        var response = await client.PostAsync($"/api/Order/cancel/{checkout.Order.Id}", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(IntentIdFrom(checkout.ClientSecret), _factory.Payments.CanceledIntents);

        var product = await client.GetFromJsonAsync<ProductDto>($"/api/Product/{productId}");
        Assert.Equal(10, product!.Quantity);
    }

    [Fact]
    public async Task Checkout_WhenPaidButWebhookMissing_CompletesOrderAndRefundsOnCancel()
    {
        var (client, checkout, _) = await CustomerWithCheckoutAsync(quantity: 1);
        var intentId = IntentIdFrom(checkout.ClientSecret);

        // The customer paid in Stripe, but the webhook never reached the API
        _factory.Payments.MarkAsSucceeded(intentId);

        var retry = await client.PostAsync("/api/Order/checkout", null);
        Assert.Equal(HttpStatusCode.Conflict, retry.StatusCode);

        var order = await client.GetFromJsonAsync<OrderDto>($"/api/Order/{checkout.Order.Id}");
        Assert.Equal("Ordered", order!.StatusName);

        // Canceling a paid order refunds it
        var cancel = await client.PostAsync($"/api/Order/cancel/{checkout.Order.Id}", null);
        Assert.Equal(HttpStatusCode.OK, cancel.StatusCode);
        Assert.Contains(intentId, _factory.Payments.RefundedIntents);
    }
}