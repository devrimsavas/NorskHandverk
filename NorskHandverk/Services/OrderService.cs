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

        // Interface'deki isminle (UpdateORderAfterPayment) birebir aynı
        public async Task UpdateORderAfterPayment(string paymentIntentId)
        {
            // 1. Önce siparişi bul (Sade sorgu)
            var order = await _dbContext.Orders
                .FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId);

            // EĞER SİPARİŞ BULUNAMAZSA: 500 HATASI VERME, SADECE LOG AT
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
                // Sepeti 'abandoned' (3) statüsüne çekiyoruz ki Frontend'den gitsin
                cart.CartStatusId = 3;
            }
            else
            {
                Console.WriteLine($"!!! UYARI: Müşteri {order.CustomerId} için 'checkedOut' statüsünde sepet bulunamadı.");
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}