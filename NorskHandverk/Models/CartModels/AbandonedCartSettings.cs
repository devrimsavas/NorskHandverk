namespace NorskHandverk.Models.CartModels
{
    // Bound to the "AbandonedCarts" section in appsettings.json
    public class AbandonedCartSettings
    {
        // An active cart that has not changed for this long is abandoned (default: 24 hours)
        public int TimeoutMinutes { get; set; } = 1440;

        // How often the background job looks for abandoned carts (default: every hour)
        public int CheckIntervalMinutes { get; set; } = 60;
    }
}