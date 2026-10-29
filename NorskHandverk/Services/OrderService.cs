using Microsoft.EntityFrameworkCore;
using NorskHandverk.Models;
using NorskHandverk.Models.CartModels;
using NorskHandverk.Models.OrderModels;
using NorskHandverk.Models.TransactionModels;
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

            // Payment succeeded: mark the order as ordered
            order.OrderStatusId = (int)OrderStatusType.Ordered;

            // Mark the pending transaction of this order as successful
            var transaction = await _dbContext.Transactions
                .FirstOrDefaultAsync(t => t.OrderId == order.Id && t.TransactionStatusId == (int)TransactionStatusType.Pending);

            if (transaction != null)
            {
                transaction.TransactionStatusId = (int)TransactionStatusType.Success;
            }

            // Find the cart this order was created from and mark it as completed
            var cart = order.CartId.HasValue
                ? await _dbContext.Carts.FindAsync(order.CartId.Value)
                : null;

            if (cart != null)
            {
                cart.CartStatusId = (int)CartStatusType.Completed;
            }
            else
            {
                Console.WriteLine($"Warning: order {order.OrderNumber} has no linked cart.");
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}