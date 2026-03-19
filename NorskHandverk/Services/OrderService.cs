using Microsoft.EntityFrameworkCore;
using NorskHandverk.Models;
using NorskHandverk.Models.OrderModels;
using System.Threading.Tasks;

namespace NorskHandverk.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _dbContext;

        public OrderService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        
        public async Task UpdateORderAfterPayment(string paymentIntentId)
        {
            // find order 
            var order = await _dbContext.Orders
                .FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId);

            // if there is not any order 
            if (order == null)
            {
                Console.WriteLine($"!!! Error  '{paymentIntentId}' ID' does not exist. It might come after webhook.");
                return;
            }

            // 2. order status 2 now 
            order.OrderStatusId = 2;

            //find cart and make status 3
            var cart = await _dbContext.Carts
                .FirstOrDefaultAsync(c => c.CustomerId == order.CustomerId && c.CartStatusId == 2);

            if (cart != null)
            {
                //  'abandoned' (3) status (need to change later)
                cart.CartStatusId = 3;
            }
            else
            {
                Console.WriteLine($"!!! Warning: Custoer  {order.CustomerId} has not any cart with  'checkedOut' status.");
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}