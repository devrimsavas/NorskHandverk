using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NorskHandverk.Models;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.ProductDTOs;
using AutoMapper;
namespace NorskHandverk.Controllers.ProductController
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ProductController:ControllerBase 
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper; 
        public ProductController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        [HttpGet]
        //GET ALL PRODUCTS 
        public async Task<ActionResult<IEnumerable<ProductReadDTO>>> GetAllProducts()
        {
            var products=await _dbContext.Products.ToListAsync();
            var results = _mapper.Map<IEnumerable<ProductReadDTO>>(products);
            return Ok(results);
        }

    }
}
