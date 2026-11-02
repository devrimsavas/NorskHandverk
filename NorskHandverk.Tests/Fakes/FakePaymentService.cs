using NorskHandverk.Services;
using Stripe;

namespace NorskHandverk.Tests.Fakes;

// Stands in for StripeService in tests: no network calls, and every call is recorded
public class FakePaymentService : IPaymentService
{
    private readonly Dictionary<string, PaymentIntent> _intents = new();

    public List<string> CanceledIntents { get; } = new();
    public List<string> RefundedIntents { get; } = new();

    public Task<PaymentIntent> CreatePaymentIntent(long amount)
    {
        var id = $"pi_test_{Guid.NewGuid():N}";
        var intent = new PaymentIntent
        {
            Id = id,
            Amount = amount,
            Currency = "nok",
            Status = "requires_payment_method",
            ClientSecret = $"{id}_secret_test",
        };

        _intents[id] = intent;
        return Task.FromResult(intent);
    }

    public Task<PaymentIntent> GetPaymentIntent(string paymentIntentId)
    {
        return Task.FromResult(_intents[paymentIntentId]);
    }

    public Task CancelPaymentIntent(string paymentIntentId)
    {
        CanceledIntents.Add(paymentIntentId);
        _intents[paymentIntentId].Status = "canceled";
        return Task.CompletedTask;
    }

    public Task RefundPayment(string paymentIntentId)
    {
        RefundedIntents.Add(paymentIntentId);
        return Task.CompletedTask;
    }

    // Lets a test pretend that the customer paid in Stripe
    public void MarkAsSucceeded(string paymentIntentId)
    {
        _intents[paymentIntentId].Status = "succeeded";
    }
}