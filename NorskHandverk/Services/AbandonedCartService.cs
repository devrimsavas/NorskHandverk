using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NorskHandverk.Models;
using NorskHandverk.Models.CartModels;
using NorskHandverk.Models.ProductModels;

namespace NorskHandverk.Services
{
    // Marks active carts that have not changed for a while as abandoned and returns their reserved stock
    public class AbandonedCartService
    {
        private readonly AppDbContext _dbContext;
        private readonly AbandonedCartSettings _settings;
        private readonly ILogger<AbandonedCartService> _logger;

        public AbandonedCartService(
            AppDbContext dbContext,
            IOptions<AbandonedCartSettings> settings,
            ILogger<AbandonedCartService> logger)
        {
            _dbContext = dbContext;
            _settings = settings.Value;
            _logger = logger;
        }

        // Returns the number of carts that were released
        public async Task<int> ReleaseAbandonedCartsAsync(CancellationToken cancellationToken = default)
        {
            var cutoff = DateTime.UtcNow.AddMinutes(-_settings.TimeoutMinutes);

            var carts = await _dbContext.Carts
                .Include(c => c.Items).ThenInclude(i => i.Product)
                .Where(c => c.CartStatusId == (int)CartStatusType.Active && c.UpdatedAt < cutoff)
                .ToListAsync(cancellationToken);

            if (carts.Count == 0)
            {
                return 0;
            }

            foreach (var cart in carts)
            {
                // Give the reserved stock back to the products
                foreach (var item in cart.Items)
                {
                    item.Product.Quantity += item.Quantity;
                    if (item.Product.Quantity > 0)
                    {
                        item.Product.Status = Status.Available;
                    }
                }

                // Items stay in the cart for history, only the status changes
                cart.CartStatusId = (int)CartStatusType.Abandoned;
                cart.UpdatedAt = DateTime.UtcNow;
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Released {Count} abandoned cart(s) and returned their stock.", carts.Count);

            return carts.Count;
        }
    }
}