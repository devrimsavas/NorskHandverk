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
            var products = await _dbContext.Products.Include(p => p.Category).Include(p => p.Brand).ToListAsync();
            var results = _mapper.Map<IEnumerable<ProductReadDTO>>(products);
            return Ok(results);
        }
        [HttpPost]
        //CREATE NEW PRODUCT 
        public async Task<ActionResult<ProductReadDTO>> CreateProduct(ProductCreateDTO productCreateDTO)
        {
            var existedProduct=await _dbContext.Products.FirstOrDefaultAsync(p=>p.Title.ToLower().Trim()==productCreateDTO.Title.ToLower().Trim());
            if (existedProduct!=null)
            {
                return Conflict(new { Message = $"Product with title {existedProduct.Title} already exists" });
            }
            //Category Check 
            var existedCategory=await _dbContext.Categories.AnyAsync(c=>c.Id==productCreateDTO.CategoryId);
            if (!existedCategory)
            {
                return BadRequest(new { Message = "Category does not exist" });

            }
            //Brand Check
            var existedBrand=await _dbContext.Brands.AnyAsync(b=>b.Id==productCreateDTO.BrandId);
            if (!existedBrand)
            {
                return BadRequest(new { Message = "Brand does not exist" });
            }
            var newProduct=_mapper.Map<Product>(productCreateDTO);
            _dbContext.Products.Add(newProduct);
            await _dbContext.SaveChangesAsync();
            var createdProduct=await _dbContext.Products.Include(p=>p.Category).Include(p=>p.Brand).FirstOrDefaultAsync(p=>p.Id==newProduct.Id);
            var readDto = _mapper.Map<ProductReadDTO>(createdProduct);

            return CreatedAtAction(nameof(GetAllProducts), new {id=newProduct.Id}, readDto);

        }

    }
}
