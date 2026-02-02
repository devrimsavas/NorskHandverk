//Brand.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace NorskHandverk.Models.ProductModels
{
    public class Brand
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }=string.Empty;
        //one to many 
        public ICollection<Product> Products { get; set; } = new List<Product>();

    }
}
