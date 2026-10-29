using NorskHandverk.Models.CustomerModels;
using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.CustomerDTOs
{
    public class UpdateCustomerDTO
    {
        [MinLength(3)]
        public string? Name { get; set; }
        [StringLength(100, MinimumLength = 1)]
        public string? Surname { get; set; }
        [EmailAddress]
        public string? Email {  get; set; }
        [MinLength(6)]
        public string? Password { get; set; }
        [MinLength(3)]
        public string? Address { get; set; }
        [Phone]
        public string? TelephoneNumber { get; set; }

        


    }
}
