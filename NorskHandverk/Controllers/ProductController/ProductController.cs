using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NorskHandverk.Models;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.ProductDTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using NorskHandverk.Services;
namespace NorskHandverk.Controllers.ProductController

{
    [ApiController]
    [Route("api/[Controller]")]
    public class ProductController:ControllerBase 
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IImageStorage _imageStorage;

        public ProductController(AppDbContext dbContext, IMapper mapper,IImageStorage imageStorage)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _imageStorage=imageStorage;
        }
        [HttpGet]
        //GET ALL PRODUCTS 
        public async Task<ActionResult<IEnumerable<ProductReadDTO>>> GetAllProducts()
        {
            var products = await _dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            var results = _mapper.Map<IEnumerable<ProductReadDTO>>(products);
            return Ok(results);
        }
        //GET A PRODUCT
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReadDTO>> GetAProduct(int id)
        {
            var existedProduct = await _dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
            if (existedProduct ==null)
            {
                return NotFound(new { Message = "Product does not exist" });
            }
            var ReadDTO=_mapper.Map<ProductReadDTO>(existedProduct);
            return Ok(ReadDTO);
        }
        [Authorize(Roles = "Admin")]
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

            return CreatedAtAction(nameof(GetAProduct), new {id=newProduct.Id}, readDto);
        }
        //UPDATE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductReadDTO>> UpdateProduct(int id, ProductUpdateDTO productUpdateDTO)
        {
            
            var existedProduct = await _dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existedProduct == null)
            {
                return NotFound(new { Message = "Product does not exist" });
            }

           
            existedProduct.Title = productUpdateDTO.Title ?? existedProduct.Title;
            existedProduct.Description = productUpdateDTO.Description ?? existedProduct.Description;
            existedProduct.Price = productUpdateDTO.Price ?? existedProduct.Price;
            existedProduct.ProductImage = productUpdateDTO.ProductImage ?? existedProduct.ProductImage;
            existedProduct.Quantity = productUpdateDTO.Quantity ?? existedProduct.Quantity;
            existedProduct.IsDeleted = productUpdateDTO.IsDeleted ?? existedProduct.IsDeleted;
            existedProduct.Discount = productUpdateDTO.Discount ?? existedProduct.Discount;
            existedProduct.Status=existedProduct.Quantity>0 ? Status.Available : Status.Out_Of_Stock;

            //Category check 
            if (productUpdateDTO.CategoryId.HasValue)
            {
                var categoryExists = await _dbContext.Categories.AnyAsync(c => c.Id == productUpdateDTO.CategoryId.Value);
                if (!categoryExists) return BadRequest(new { Message = "Category does not exist" });
                existedProduct.CategoryId = productUpdateDTO.CategoryId.Value;
            }

            // Brand check 
            if (productUpdateDTO.BrandId.HasValue)
            {
                var brandExists = await _dbContext.Brands.AnyAsync(b => b.Id == productUpdateDTO.BrandId.Value);
                if (!brandExists) return BadRequest(new { Message = "Brand does not exist" });
                existedProduct.BrandId = productUpdateDTO.BrandId.Value;
            }

            await _dbContext.SaveChangesAsync();

            
            var resultProduct = await _dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .FirstAsync(p => p.Id == existedProduct.Id);

            var readDTO = _mapper.Map<ProductReadDTO>(resultProduct);
            return Ok(readDTO);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")] 
        public async Task<ActionResult<ProductReadDTO>> DeleteProduct(int id)
        {
            var existedProduct=await _dbContext.Products.Include(p=>p.Category).Include(p=>p.Brand).FirstOrDefaultAsync(p=>p.Id == id);
            if (existedProduct == null)
            {
                return NotFound(new { Message = "Product does not exist" });
            }
            //soft delete 
            existedProduct.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
            var readTo=_mapper.Map<ProductReadDTO>(existedProduct);
            return Ok(readTo);
        }

        private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxImageSize = 5 * 1024 * 1024; // 5 MB

        //UPLOAD PRODUCT IMAGE
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/image")]
        public async Task<ActionResult<ProductReadDTO>> UploadProductImage(int id, IFormFile file)
        {
            var product = await _dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

            if (product == null)
            {
                return NotFound(new { Message = "Product does not exist" });
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "No file was uploaded." });
            }

            if (file.Length > MaxImageSize)
            {
                return BadRequest(new { Message = "The image must be 5 MB or smaller." });
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedImageExtensions.Contains(extension) || !file.ContentType.StartsWith("image/"))
            {
                return BadRequest(new { Message = "Only JPG, PNG and WebP images are allowed." });
            }

            var oldImage = product.ProductImage;

            product.ProductImage = await _imageStorage.SaveProductImageAsync(file);
            await _dbContext.SaveChangesAsync();

            // Remove the previous file only after the new one is saved
            if (!string.IsNullOrEmpty(oldImage))
            {
                await _imageStorage.DeleteProductImageAsync(oldImage);
            }

            return Ok(_mapper.Map<ProductReadDTO>(product));
        }





    }
}
