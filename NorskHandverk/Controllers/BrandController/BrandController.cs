using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NorskHandverk.Models;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.BrandDTOs;
using AutoMapper;
namespace NorskHandverk.Controllers.BrandController
{

    [ApiController]
    [Route("api/[Controller]")]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public BrandController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<ICollection<BrandReadDTO>>> GetBrands()
        {
            var brands = await _dbContext.Brands.ToListAsync();
            var results=_mapper.Map<ICollection<BrandReadDTO>>(brands);

            return Ok(results);



        }
        //GET an brand by id 
        [HttpGet("{id}")]
        public async Task<ActionResult<BrandReadDTO>> GetBrandById(int id)
        {
            var existedBrand=await _dbContext.Brands.FirstOrDefaultAsync(b => b.Id == id);  
            if (existedBrand == null)
            {
                return NotFound(new { Message = "Brand does not exist" });
            }
            var result=_mapper.Map<BrandReadDTO>(existedBrand);

            return Ok(result);
        }
        //CREATE A NEW  BRAND 
        [HttpPost]
        public async Task<ActionResult<BrandReadDTO>> CreateBrand(BrandCreateDTO brandCreateDTO)
        {
            //check it already existed 
            var existedBrand=await _dbContext.Brands.FirstOrDefaultAsync(b=>b.Name.ToLower().Trim()==brandCreateDTO.Name.ToLower().Trim());
            if (existedBrand != null)
            {
                return Conflict(new { Message = $"Database has already a brand named {existedBrand.Name}" });
            }
            var newBrand=_mapper.Map<Brand>(brandCreateDTO);
            _dbContext.Brands.Add(newBrand);
            await _dbContext.SaveChangesAsync();
            //return BrandReadDTO 
            var readTo=_mapper.Map<BrandReadDTO>(newBrand);
            return CreatedAtAction(nameof(GetBrandById), new {id=newBrand.Id}, readTo);
        }

        //Update a Brand 
        [HttpPut("{id}")] 
        public async Task<ActionResult<BrandReadDTO>> UpdateBrand(BrandUpdateDTO brandUpdateDTO, int id)
        {
            var existedBrand=await _dbContext.Brands.FirstOrDefaultAsync(b=>b.Id==id);
            if (existedBrand==null)
            {
                return NotFound(new { Message = "Brand does not exit" });
            }
            existedBrand.Name = brandUpdateDTO.Name ?? existedBrand.Name;
            await _dbContext.SaveChangesAsync();
            var readDTO=_mapper.Map<BrandReadDTO>(existedBrand);
            
            return Ok(readDTO);    
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<BrandReadDTO>> DeleteBrand(int id)
        {
            var existedBrand = await _dbContext.Brands.FirstOrDefaultAsync(b => b.Id == id);
            if (existedBrand == null)
            {
                return NotFound(new { Message = "Brand does not exist" });
            }
            var brandHasProduct = await _dbContext.Products.AnyAsync(p => p.BrandId == id);
            if (brandHasProduct)
            {
                return Conflict(new { Message = "Brand has products. Cannot be deleted" });
            }
            _dbContext.Brands.Remove(existedBrand);
            await _dbContext.SaveChangesAsync();
            var readDTO = _mapper.Map<BrandReadDTO>(existedBrand);
            return Ok(readDTO);
        }
    }
}
