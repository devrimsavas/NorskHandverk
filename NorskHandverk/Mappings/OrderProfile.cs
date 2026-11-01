using NorskHandverk.Models;
using NorskHandverk.Models.OrderModels;
using NorskHandverk.DTOs.OrderDTOs;
using AutoMapper;


namespace NorskHandverk.Mappings
{
    public class OrderProfile:Profile
    {
        public OrderProfile()
        {
            CreateMap<Order,ReadOrderDTO>()
                .ForMember(dest=>dest.StatusName, opt=>opt.MapFrom(src=> src.OrderStatus.Name))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Items.Sum(i => i.UnitPrice * i.Quantity)))
                .ForMember(dest => dest.TotalPriceIncVat, opt => opt.MapFrom(src => src.Items.Sum(i => (i.UnitPrice * i.Quantity) * (1 + i.VatRate))));
            //for Item List orderItem should be same with ReadOrderDTO
            CreateMap<OrderItem,ReadOrderItemDTO>()
                .ForMember(dest=>dest.TotalPrice, opt=>opt.MapFrom(src=>src.UnitPrice*src.Quantity));
            CreateMap<Order, ReadOrderDTO>()
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.OrderStatus.Name))
                .ForMember(dest => dest.CustomerName,
                    opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name + " " + src.Customer.Surname : string.Empty))
                .ForMember(dest => dest.CustomerEmail,
                    opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : string.Empty))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Items.Sum(i => i.UnitPrice * i.Quantity)))
                .ForMember(dest => dest.TotalPriceIncVat, opt => opt.MapFrom(src => src.Items.Sum(i => (i.UnitPrice * i.Quantity) * (1 + i.VatRate))));
                    }

    }
}
