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
            // Direkt intent nesnesini dönüyoruz
            return await service.CreateAsync(options);
        }

    }
}
