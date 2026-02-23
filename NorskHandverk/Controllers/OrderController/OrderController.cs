using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NorskHandverk.Models;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.Models.OrderModels;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.DTOs.OrderDTOs;
using AutoMapper;
using System.Reflection.Metadata.Ecma335;

namespace NorskHandverk.Controllers.OrderController
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController:ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public OrderController(AppDbContext dbContext, IMapper mapper) 
        { 
            _dbContext = dbContext;
            _mapper = mapper;
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
        [HttpPost("checkout/{customerId}")]
        public async Task<ActionResult<ReadOrderDTO>> Checkout(int customerId)
        {
            // Find the active cart
            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId && c.CartStatus.Name == "active");

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest(new { Message = "Active cart not found or empty." });
            }

            
            var checkedOutStatus = await _dbContext.CartStatuses.FirstOrDefaultAsync(s => s.Name == "checkedOut");
            var orderedStatus = await _dbContext.OrderStatuses.FirstOrDefaultAsync(s => s.Name == "Ordered");

            if (checkedOutStatus == null || orderedStatus == null)
            {
                return BadRequest(new { Message = "Status definitions are missing in DB." });
            }

            // Create New Order
            var order = new Order
            {
                CustomerId = customerId,
                OrderNumber = "ORD-" + DateTime.Now.Ticks,
                OrderDate = DateTime.UtcNow,
                OrderStatusId = orderedStatus.Id,
                Items = new List<OrderItem>()
            };

            // Snapshot prices and transfer items
            foreach (var cartItem in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    ProductName = cartItem.ProductName,
                    UnitPrice = cartItem.UnitPrice,
                    VatRate = cartItem.VatRate,
                    Quantity = cartItem.Quantity
                };
                order.Items.Add(orderItem);
            }

            // Update Cart Status to checkedOut (Id=2)
            cart.CartStatusId = checkedOutStatus.Id;

            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            // Explicitly load navigation properties for the DTO
            await _dbContext.Entry(order).Reference(o => o.OrderStatus).LoadAsync();
            await _dbContext.Entry(order).Collection(o => o.Items).LoadAsync();

            var readDTO = _mapper.Map<ReadOrderDTO>(order);
            return Ok(readDTO);
        }

        //CANCEL ORDER 
        [HttpPost("cancel/{orderId}")]
        public async Task<ActionResult> CancelOrder(int orderId)
        {
            // 1. Fetch the order including its items
            var order = await _dbContext.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound(new { Message = "Order not found." });
            }

            // 2. Prevent re-canceling or canceling delivered orders
            if (order.OrderStatusId == 1)
            {
                return BadRequest(new { Message = "Order is already canceled." });
            }

            // 3. Loop through items to restore stock levels
            foreach (var item in order.Items)
            {
                var product = await _dbContext.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    // Add quantity back to inventory
                    product.Quantity += item.Quantity;

                    // Re-activate product if it was out of stock
                    if (product.Quantity > 0 && product.Status == Status.Out_Of_Stock)
                    {
                        product.Status = Status.Available;
                    }
                }
            }

            // 4. Update status to Canceled
            order.OrderStatusId = 1;

            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = $"Order {order.OrderNumber} canceled and stocks updated." });
        }




    }
}
