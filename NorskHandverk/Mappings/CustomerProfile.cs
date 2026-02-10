using NorskHandverk.Models;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.DTOs.CustomerDTOs;
using AutoMapper;
namespace NorskHandverk.Mappings
{
    public class CustomerProfile:Profile
    {
        public CustomerProfile()
        {
            CreateMap<Customer,ReadCustomerDTO>()
                .ForMember(dest=>dest.MemberShipStatus,opt=>opt.MapFrom(src=>src.MemberShipStatus.Name));
            //se
            CreateMap<CreateCustomerDTO, Customer>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());




        }


    }
}
