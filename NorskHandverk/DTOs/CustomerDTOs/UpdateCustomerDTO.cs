using NorskHandverk.Models.CustomerModels;
using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.CustomerDTOs
{
    public class UpdateCustomerDTO
    {
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Email {  get; set; }
        
        public string? Password { get; set; }
        
        public string? Address { get; set; }
        
        public string? TelephoneNumber { get; set; }

        


    }
}
