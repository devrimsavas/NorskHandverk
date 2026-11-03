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
                o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.ProductImageUrl,
                o => o.ConvertUsing<ProductImageUrlConverter, string?>(s => s.ProductImage));



            CreateMap<ProductCreateDTO, Product>()
                .ForMember(dest => dest.Title,
                    opt => opt.MapFrom(src => src.Title.Trim().ToLower()))
                .ForMember(dest => dest.Description,
                    opt => opt.MapFrom(src => src.Description ?? string.Empty))
                .ForMember(dest => dest.ProductImage,
                    opt => opt.MapFrom(src => src.ProductImage ?? string.Empty));

            CreateMap<ProductUpdateDTO, Product>()
                .ForMember(dest => dest.Title,
                opt => opt.MapFrom(src => src.Title.Trim().ToLower()));
                
                
        }
    }
}
