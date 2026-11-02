using Microsoft.Extensions.Options;
using NorskHandverk.Models.CartModels;

namespace NorskHandverk.Services
{
    // Runs AbandonedCartService on a schedule while the API is running
    public class AbandonedCartJob : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly AbandonedCartSettings _settings;
        private readonly ILogger<AbandonedCartJob> _logger;

        public AbandonedCartJob(
            IServiceScopeFactory scopeFactory,
            IOptions<AbandonedCartSettings> settings,
            ILogger<AbandonedCartJob> logger)
        {
            _scopeFactory = scopeFactory;
            _settings = settings.Value;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var timer = new PeriodicTimer(TimeSpan.FromMinutes(_settings.CheckIntervalMinutes));

            // Run once at startup, then on every tick until the app stops
            do
            {
                try
                {
                    // A new scope gives each run its own short-lived DbContext
                    using var scope = _scopeFactory.CreateScope();
                    var service = scope.ServiceProvider.GetRequiredService<AbandonedCartService>();
                    await service.ReleaseAbandonedCartsAsync(stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    // One failed run must not stop the job for good
                    _logger.LogError(ex, "Releasing abandoned carts failed.");
                }
            }
            while (await timer.WaitForNextTickAsync(stoppingToken));
        }
    }
}