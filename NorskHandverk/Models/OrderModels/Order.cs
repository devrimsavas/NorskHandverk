//Order.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.Models.ProductModels;
namespace NorskHandverk.Models.OrderModels;


public class Order
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string OrderNumber { get; set; }
    
    //Order Status Navigation 
    public int OrderStatusId { get; set; }
    public OrderStatus OrderStatus { get; set; }
    //Customer Navigation 
    public int CustomerId { get; set; }
    public Customer Customer { get; set; }  

    //order items 
    public ICollection<OrderItem> Items { get; set; }=new List<OrderItem>();    
    //order date
    public DateTime OrderDate { get; set; }



    

    


}
