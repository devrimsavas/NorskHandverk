using NorskHandverk.Models.CartModels;
using NorskHandverk.DTOs.CartDTOs;
using AutoMapper;

namespace NorskHandverk.Mappings
{
    public class CartProfile:Profile
    {
        public CartProfile()
        {
            //find Name field in CartStatus and copy to the statusName in readCardDTO 
            CreateMap<Cart, ReadCartDTO>()
            .ForMember(dest => dest.StatusName,
            opt => opt.MapFrom(src => src.CartStatus.Name));
            CreateMap<CartItem, ReadCartItemDTO>()
                .ForMember(dest=>dest.ProductName,opt=>opt.MapFrom(src=>src.ProductName));

            CreateMap<UpdateCartItemDTO, CartItem>();
            CreateMap<CartItem, ReadCartItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductImage : string.Empty));

        }
      
    }
}
