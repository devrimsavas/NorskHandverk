using Microsoft.AspNetCore.Mvc;
using NorskHandverk.Models.CustomerModels;
using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.CustomerDTOs
{
    public class CreateCustomerDTO
    {
        [Required]
        [MinLength(3)]
        public string Name { get; set; }
        [Required]
        [StringLength(100)]
        public string Surname { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        
        [Required]
        public string Address { get; set; }
        [Required]
        public string TelephoneNumber { get; set; }
        


        //public MemberShipStatus MemberShipStatus { get; set; }
    }
}
