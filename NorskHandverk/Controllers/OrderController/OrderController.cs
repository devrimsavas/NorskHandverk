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
       
    }
}
