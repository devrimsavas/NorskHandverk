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
            
            CreateMap<CreateCustomerDTO, Customer>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            CreateMap<UpdateCustomerDTO, Customer>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                //do not re-write empty fields 
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
                



        }


    }
}
