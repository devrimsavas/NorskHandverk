//OrderItem.cs
using NorskHandverk.Models.ProductModels;
namespace NorskHandverk.Models.OrderModels
{
    public class OrderItem
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal VatRate { get; set; }
        public int Quantity { get; set; }
        
        //PRoduct navigation
        public Product Product { get; set; }
        public int ProductId { get; set; }
        //Order Navigation 
        public Order Order { get; set; }
        public int OrderId { get; set; }    
        

    }
}
