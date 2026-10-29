using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorskHandverk.DTOs.OrderDTOs;
using NorskHandverk.Models;
using NorskHandverk.Models.CartModels;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.Models.OrderModels;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.Models.TransactionModels;
using NorskHandverk.Services;
using Stripe;

using System.Reflection.Metadata.Ecma335;
using System.Transactions;
using MyOrder = NorskHandverk.Models.OrderModels.Order;

namespace NorskHandverk.Controllers.OrderController
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController:ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        //adding payment service for stripe
        private readonly IPaymentService _paymentService;
        private readonly IConfiguration _configuration;
        private readonly IOrderService _orderService;
        public OrderController(AppDbContext dbContext, IMapper mapper,IPaymentService paymentService, IConfiguration configuration, IOrderService orderService) 
        { 
            _dbContext = dbContext;
            _mapper = mapper;
            //payment service update
            _paymentService=paymentService;
            _configuration = configuration;
            _orderService = orderService;
            
            
        }
        [HttpGet]
        //GET ALL ORDERS 
        public async Task<ActionResult<ICollection<ReadOrderDTO>>> GetAllOrders()
        {
            var orders=await _dbContext.Orders.Include(o=>o.OrderStatus).Include(o=>o.Customer).Include(o=>o.Items)
                .ThenInclude(i=>i.Product).ToListAsync();
            var readDTO=_mapper.Map<ICollection<ReadOrderDTO>>(orders);
            return Ok(readDTO);
        }
        //get order by id 
        [HttpGet("{id}")]
        public async Task<ActionResult<ReadOrderDTO>> GetOrderById(int id)
        {
            var order=await _dbContext.Orders
                .Include(o=>o.OrderStatus)
                .Include(o=>o.Customer)
                .Include(o=>o.Items)
                .ThenInclude(i=>i.Product)
                .FirstOrDefaultAsync(o=>o.Id==id);    
            if (order==null)
            {
                return NotFound(new { Message = "Order Not found" });
            }

            var readDTO = _mapper.Map<ReadOrderDTO>(order);
            return Ok(readDTO);                

        }
        //CHECK OUT 
        //updated with payment service instead of direct 
        [HttpPost("checkout/{customerId}")]
        public async Task<ActionResult<object>> Checkout(int customerId)
        {
            // 1. FIRST CHECK: Does the user already have an order awaiting payment?
            // This prevents creating new orders and new Stripe intents on page refresh/retry.
            var existingOrder = await _dbContext.Orders
                .Include(o => o.Items)
                .Include(o => o.OrderStatus)
                .FirstOrDefaultAsync(o => o.CustomerId == customerId && o.OrderStatusId == (int)OrderStatusType.AwaitingPayment);

            if (existingOrder != null && !string.IsNullOrEmpty(existingOrder.PaymentIntentId))
            {
                // Use Stripe Service directly to fetch the existing intent
                var service = new Stripe.PaymentIntentService();
                var intent = await service.GetAsync(existingOrder.PaymentIntentId);

                // If the intent is still valid for payment, reuse it
                if (intent.Status != "canceled" && intent.Status != "succeeded")
                {
                    var existingDto = _mapper.Map<ReadOrderDTO>(existingOrder);
                    return Ok(new { Order = existingDto, ClientSecret = intent.ClientSecret });
                }
                // If it was canceled, the code will fall through and create a new one below
            }

            // 2. ONLY look for ACTIVE carts - (checkedOut carts are handled by the block above)
            var cart = await _dbContext.Carts
                .Include(c => c.CartStatus)
                .Include(c => c.Items).ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId && c.CartStatusId == (int)CartStatusType.Active);

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest(new { Message = "Active cart not found or empty." });
            }

            // 3. Calculate total
            decimal totalAmount = cart.Items.Sum(i => (i.UnitPrice * i.Quantity) * (1 + i.VatRate));
            long amountInOere = (long)(Math.Round(totalAmount, 2) * 100);

            // 4. Create NEW Stripe PaymentIntent
            var paymentIntent = await _paymentService.CreatePaymentIntent(amountInOere);

            // 5. Create New Order
            var order = new MyOrder
            {
                CustomerId = customerId,
                OrderNumber = "ORD-" + DateTime.Now.Ticks,
                OrderDate = DateTime.UtcNow,
                OrderStatusId = (int)OrderStatusType.AwaitingPayment,
                PaymentIntentId = paymentIntent.Id,
                CartId=cart.Id,
                Items = cart.Items.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    ProductName = ci.ProductName,
                    UnitPrice = ci.UnitPrice,
                    VatRate = ci.VatRate,
                    Quantity = ci.Quantity
                }).ToList()
            };

            // 6. Update cart status to checkedOut
            cart.CartStatusId = (int)CartStatusType.CheckedOut;

            _dbContext.Orders.Add(order);

            // 7. Add transaction record
            _dbContext.Transactions.Add(new NorskHandverk.Models.TransactionModels.Transaction
            {
                TransactionNumber = "TRX-" + DateTime.Now.Ticks,
                Amount = totalAmount,
                Currency = "NOK",
                Order = order,
                TransactionMethodId = (int)TransactionMethodType.Card,
                TransactionProviderId = (int)TransactionProviderType.Stripe,
                TransactionStatusId = (int)TransactionStatusType.Pending,
                CreateadAt = DateTime.UtcNow
            });

            await _dbContext.SaveChangesAsync();

            // 8. Load for DTO
            await _dbContext.Entry(order).Reference(o => o.OrderStatus).LoadAsync();
            await _dbContext.Entry(order).Collection(o => o.Items).LoadAsync();

            var readDTO = _mapper.Map<ReadOrderDTO>(order);
            return Ok(new { Order = readDTO, ClientSecret = paymentIntent.ClientSecret });
        }

        
        //CANCEL ORDER 
        [HttpPost("cancel/{orderId}")]
        public async Task<ActionResult> CancelOrder(int orderId)
        {
            var order = await _dbContext.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound(new { Message = "Order not found." });
            }

            var isAwaitingPayment = order.OrderStatusId == (int)OrderStatusType.AwaitingPayment;
            var isPaid = order.OrderStatusId == (int)OrderStatusType.Ordered;

            // Only unpaid orders, or paid orders that are not yet in progress, can be canceled
            if (!isAwaitingPayment && !isPaid)
            {
                return BadRequest(new { Message = "Only orders that are awaiting payment or ordered can be canceled." });
            }

            // Call Stripe first: if it fails, nothing in the database is changed
            if (!string.IsNullOrEmpty(order.PaymentIntentId))
            {
                try
                {
                    if (isAwaitingPayment)
                    {
                        await _paymentService.CancelPaymentIntent(order.PaymentIntentId);
                    }
                    else
                    {
                        await _paymentService.RefundPayment(order.PaymentIntentId);
                    }
                }
                catch (StripeException e)
                {
                    return BadRequest(new { Message = $"Payment provider error: {e.Message}" });
                }
            }

            // Restore stock levels
            foreach (var item in order.Items)
            {
                var product = await _dbContext.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Quantity += item.Quantity;

                    if (product.Quantity > 0 && product.Status == Status.Out_Of_Stock)
                    {
                        product.Status = Status.Available;
                    }
                }
            }

            // Update the transaction: an unpaid one is canceled, a paid one is refunded
            var transaction = await _dbContext.Transactions
                .FirstOrDefaultAsync(t => t.OrderId == order.Id &&
                    (t.TransactionStatusId == (int)TransactionStatusType.Pending ||
                     t.TransactionStatusId == (int)TransactionStatusType.Success));

            if (transaction != null)
            {
                transaction.TransactionStatusId = isAwaitingPayment
                    ? (int)TransactionStatusType.Canceled
                    : (int)TransactionStatusType.Refunded;
            }

            // An unpaid order leaves its checked-out cart behind, so mark it as abandoned
            if (isAwaitingPayment)
            {
                var cart = order.CartId.HasValue
                    ? await _dbContext.Carts.FindAsync(order.CartId.Value)
                    : null;

                if (cart != null)
                {
                    cart.CartStatusId = (int)CartStatusType.Abandoned;
                }
            }

            order.OrderStatusId = (int)OrderStatusType.Canceled;

            await _dbContext.SaveChangesAsync();

            var message = isPaid
                ? $"Order {order.OrderNumber} canceled and payment refunded."
                : $"Order {order.OrderNumber} canceled.";

            return Ok(new { Message = message });
        }

        //WEBHOOK 
        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                // Verifying the event with the secret key from terminal
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _configuration["Stripe:WebhookSecret"]
                );

                // Handling the success payment event 
                if (stripeEvent.Type == Stripe.EventTypes.PaymentIntentSucceeded)
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                    if (paymentIntent != null)
                    {
                        // CRITICAL: Using the exact name from your interface 'UpdateORderAfterPayment'
                        await _orderService.UpdateORderAfterPayment(paymentIntent.Id);
                    }
                }

                return Ok();
            }
            catch (StripeException e)
            {
                // Using 'e' to log or debug if needed
                Console.WriteLine($"Stripe Webhook Error: {e.Message}");
                return BadRequest();
            }
            catch (Exception ex)
            {
                // Using 'ex' to log general errors
                Console.WriteLine($"General Webhook Error: {ex.Message}");
                return StatusCode(500);
            }
        }




    }
}
