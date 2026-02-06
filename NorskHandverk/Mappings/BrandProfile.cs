using AutoMapper;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.BrandDTOs;
namespace NorskHandverk.Mappings
{
    public class BrandProfile:Profile 
    {
        public BrandProfile() 
        {
            CreateMap<Brand,BrandReadDTO>();
            CreateMap<BrandCreateDTO, Brand>()
                .ForMember(dest => dest.Name,
                opt => opt.MapFrom(src => src.Name.Trim().ToLower()));

            CreateMap<BrandUpdateDTO, Brand>()
               .ForMember(dest => dest.Name,
               opt=>opt.MapFrom((src,dest)=>
               string.IsNullOrWhiteSpace (src.Name)
               ? dest.Name 
               : src.Name.Trim().ToLower()
               ));


        }
    }
}
