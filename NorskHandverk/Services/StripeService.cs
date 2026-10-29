using Stripe;
using Microsoft.Extensions.Configuration;

namespace NorskHandverk.Services
{
    public class StripeService:IPaymentService
    {
        private readonly IConfiguration _configuration;
        //using IConfiguration to access SecretKey in appsettings.json
        public StripeService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<PaymentIntent> CreatePaymentIntent(long amount)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "nok",
                PaymentMethodTypes = new List<string> { "card" },
            };
            var service = new PaymentIntentService();
            // intent object
            return await service.CreateAsync(options);
        }

        public async Task CancelPaymentIntent(string paymentIntentId)
        {
            var service = new PaymentIntentService();
            await service.CancelAsync(paymentIntentId);
        }

        public async Task RefundPayment(string paymentIntentId)
        {
            var options = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId
            };
            var service = new RefundService();
            await service.CreateAsync(options);
        }

        public async Task<PaymentIntent> GetPaymentIntent(string paymentIntentId)
        {
            var service = new PaymentIntentService();
            return await service.GetAsync(paymentIntentId);
        }


    }
}
