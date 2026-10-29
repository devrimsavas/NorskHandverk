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

            // Find the checked-out cart and mark it as completed
            var cart = await _dbContext.Carts
                .FirstOrDefaultAsync(c => c.CustomerId == order.CustomerId && c.CartStatusId == (int)CartStatusType.CheckedOut);

            if (cart != null)
            {
                //  'abandoned' (3) status (need to change later)
                // Payment succeeded, so the checked-out cart is now completed
                cart.CartStatusId = (int)CartStatusType.Completed;
            }
            else
            {
                Console.WriteLine($"!!! Warning: Custoer  {order.CustomerId} has not any cart with  'checkedOut' status.");
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}