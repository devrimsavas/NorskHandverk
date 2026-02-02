using NorskHandverk.Models.OrderModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NorskHandverk.Models.OrderModels
{
    public class OrderStatus
    {
        [Key] 
        public int Id { get; set; }
        public string Name { get; set; }

    }
}
