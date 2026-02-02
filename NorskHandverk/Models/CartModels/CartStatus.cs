//CartStatus.cs

using NorskHandverk.Models.ProductModels;
using NorskHandverk.Models.CartModels;
using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.Models.CartModels
{
    public class CartStatus
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }    
    }
}
