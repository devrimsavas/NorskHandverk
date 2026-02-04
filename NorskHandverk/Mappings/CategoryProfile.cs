using AutoMapper;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.CategoryDTOs;
namespace NorskHandverk.Mappings
{
    public class CategoryProfile:Profile 
    {
        public CategoryProfile() 
        {
            CreateMap<Category, CategoryReadDTO>();
            CreateMap<CreateCategoryDTO, Category>();
            CreateMap<UpdateCategoryDTO, Category>();
        }
    }
}
