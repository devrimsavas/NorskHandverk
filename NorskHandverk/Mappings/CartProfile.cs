using NorskHandverk.Models.CartModels;
using NorskHandverk.DTOs.CartDTOs;
using AutoMapper;

namespace NorskHandverk.Mappings
{
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<UpdateCartItemDTO, CartItem>();

            CreateMap<CartItem, ReadCartItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductImage : string.Empty))
                .ForMember(dest => dest.ProductImageUrl, opt => opt.ConvertUsing<ProductImageUrlConverter, string?>(src => src.Product.ProductImage));

            //find Name field in CartStatus and copy to the statusName in readCardDTO 
            CreateMap<Cart, ReadCartDTO>()
                .ForMember(dest => dest.StatusName,
                    opt => opt.MapFrom(src => src.CartStatus.Name))
                .ForMember(dest => dest.CustomerName,
                    opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name + " " + src.Customer.Surname : string.Empty))
                .ForMember(dest => dest.CustomerEmail,
                    opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : string.Empty));
        }
    }
}