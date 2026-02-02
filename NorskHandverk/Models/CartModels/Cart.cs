using NorskHandverk.Models.ProductModels;
using System.ComponentModel.DataAnnotations;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.Models.OrderModels;
namespace NorskHandverk.Models.CartModels
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }
        public string CartNumber { get; set; }
        
        //Cart Status Navigation 
        public int CartStatusId { get; set; }
        public CartStatus CartStatus { get; set; }

        //Customer Navigation 
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }

        //cart items 
        public ICollection<CartItem> Items { get; set; }=new List<CartItem>();
        

    }
}
