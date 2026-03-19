// Services/IPaymentService.cs
using Stripe;

namespace NorskHandverk.Services
{
    public interface IPaymentService
    {
        // string yerine PaymentIntent dönüyoruz
        Task<PaymentIntent> CreatePaymentIntent(long amount);
    }
}