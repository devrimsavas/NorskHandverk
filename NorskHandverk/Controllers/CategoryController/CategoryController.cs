using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorskHandverk.Models;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.CategoryDTOs;

using AutoMapper; 

namespace NorskHandverk.Controllers.CategoryController
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public CategoryController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;



        }
        //GET ALL CATEGORIES 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryReadDTO>>> GetCategories()
        {

            //get categories from DB
            var categories = await _dbContext.Categories.ToListAsync();
            //use ReadCategory DTO Auto mapper 
            var result = _mapper.Map<IEnumerable<CategoryReadDTO>>(categories);

            return Ok(result);
        }
        [HttpPost]
        //CREATE NEW CATEGORY 
        public async Task<ActionResult<CategoryReadDTO>> CreateCategory(CreateCategoryDTO createCategoryDTO)
        {
            var existedCategory = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Name.ToLower() == createCategoryDTO.Name.ToLower());
            if (existedCategory != null)
            {
                return Conflict(new { Message = $"The Category with name {createCategoryDTO.Name} already exists" });
            }
            var newCategory = _mapper.Map<Category>(createCategoryDTO);
            _dbContext.Categories.Add(newCategory);
            await _dbContext.SaveChangesAsync();
            var readDto = _mapper.Map<CategoryReadDTO>(newCategory);

            return CreatedAtAction(nameof(GetCategories), new { id = newCategory.Id }, readDto);
        }
        [HttpPut]
        //UPDATE A CATEGORY 
        public async Task<ActionResult<CategoryReadDTO>> UpdateCategory(int categoryId, UpdateCategoryDTO updateCategoryDTO)
        {
            var existedCategory = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (existedCategory == null)
            {
                return NotFound(new { Message = "Category does not exist" });
            }
            existedCategory.Name = updateCategoryDTO.Name ?? existedCategory.Name;
            existedCategory.Description = updateCategoryDTO.Description ?? existedCategory.Description;
            existedCategory.DefaultVatRate = updateCategoryDTO.DefaultVatRate ?? existedCategory.DefaultVatRate;
            existedCategory.UcpCategoryCode = updateCategoryDTO.UcpCategoryCode ?? existedCategory.UcpCategoryCode;
            await _dbContext.SaveChangesAsync();
            var readDto = _mapper.Map<CategoryReadDTO>(existedCategory);

            return Ok(readDto);
        }
        //DELETE A CATEGORY 
        [HttpDelete("{id}")]
        public async Task<ActionResult<CategoryReadDTO>> DeleteCategory(int id)
        {
            //find Category 
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null)
            {
                return NotFound(new { Message = "Category does not exist" });
            }
            //is category already deleted
            if (category.IsDeleted == true)
            {
                return Conflict(new { Message = $"the category with name {category.Name} is already deleted" });
            }
            //any products connected to category ? 
            var hasProduct = await _dbContext.Products.AnyAsync(p => p.CategoryId == id && !p.IsDeleted);
            if (hasProduct)
            {
                return Conflict(new { Message = "Category has products. Cannot be deleted" });
            }
            category.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
            //deleted category 
            var readDto = _mapper.Map<CategoryReadDTO>(category);
            return Ok(readDto);

        }

    }
}
