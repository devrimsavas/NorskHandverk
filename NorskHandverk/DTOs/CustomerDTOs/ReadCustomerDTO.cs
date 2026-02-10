using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.CustomerDTOs
{
    public class ReadCustomerDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }    
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public string TelephoneNumber { get; set; }

        public string MemberShipStatus { get; set; }

    }
}
