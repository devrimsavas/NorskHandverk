//CartItem.cs

using NorskHandverk.Models.ProductModels;
using NorskHandverk.Models.OrderModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace NorskHandverk.Models.CartModels
{

    public class CartItem
    {
        [Key]
        public int Id { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal VatRate { get; set; }
        [Required]
        public int Quantity { get; set; }
        //Product Navigation 
        public Product Product { get; set; }
        public int ProductId { get; set; }

        //Cart Navigation 
        public int CartId { get; set; }
        public Cart Cart { get; set; }

        



        public bool SoftDeleted { get; set; } = false;
    }
}
