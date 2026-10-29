// Services/IPaymentService.cs
using Stripe;

namespace NorskHandverk.Services
{
    public interface IPaymentService
    {
        // return PaymentIntent
        Task<PaymentIntent> CreatePaymentIntent(long amount);
        //Cancels an unpaid payment intent so it can no longer be paid
        Task CancelPaymentIntent(string paymentIntentId);

        // Refunds the full amount of a paid payment intent
        Task RefundPayment(string paymentIntentId);
        Task<PaymentIntent> GetPaymentIntent(string paymentIntentId);

    }
}