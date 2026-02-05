using AutoMapper;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.ProductDTOs;

namespace NorskHandverk.Mappings
{
    public class ProductProfile:Profile 
    {
        public ProductProfile() 
        {
            CreateMap<Product, ProductReadDTO>()
                .ForMember(d => d.CategoryName,
                o => o.MapFrom(s => s.Category.Name))
                .ForMember(d => d.BrandName,
                o => o.MapFrom(s => s.Brand.Name))
                .ForMember(d => d.Status,
                o => o.MapFrom(s => s.Status.ToString()));
                
                
               
            CreateMap<ProductCreateDTO, Product>();
            CreateMap<ProductUpdateDTO, Product>();
        }
    }
}
