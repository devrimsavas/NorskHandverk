// Services/IPaymentService.cs
using Stripe;

namespace NorskHandverk.Services
{
    public interface IPaymentService
    {
        // return PaymentIntent
        Task<PaymentIntent> CreatePaymentIntent(long amount);
    }
}