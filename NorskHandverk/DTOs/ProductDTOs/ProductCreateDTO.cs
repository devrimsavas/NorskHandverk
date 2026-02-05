using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.ProductDTOs
{
    public class ProductCreateDTO
    {
        [Required]
        public string Title { get; set; } = null!;
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string ProductImage { get; set; }
        [Required]
        public int Quantity { get; set; } 
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public int BrandId { get; set; }
        public decimal Discount { get; set; } = 0;

    }
}
