//Customer.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NorskHandverk.Models.OrderModels;

namespace NorskHandverk.Models.CustomerModels
{
    public enum Role
    {
        Admin,
        Customer,
        Guest

    }
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }

        [Required]
        
        public string Email { get; set; }
        public Role Role { get; set; }=Role.Customer;
        [Required]
        public string PasswordHash { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string TelephoneNumber { get; set; }

        //membership
        public MemberShipStatus MemberShipStatus { get; set; }
        public int MemberShipStatusId { get; set; }

        //Order 
        public ICollection<Order> Orders { get; set; }
          

    }
}
