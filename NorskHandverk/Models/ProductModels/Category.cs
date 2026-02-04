//Category.cs 

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NorskHandverk.Models.ProductModels
{
   
    public class Category
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }=string.Empty;
        public string Description { get; set; } = "Product Description";
        [Required]
        //food 15%, default 25% VAT 
        public decimal DefaultVatRate { get; set; } = 0.25m;

        //google UCP integration mapping code v1. mock
        public string? UcpCategoryCode { get; set; }
        //one to many with product
        public ICollection<Product> Products=new List<Product>();
        //soft delete 
        public bool IsDeleted { get; set; } = false;



    }
}
