using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.ProductDTOs
{
    public class ProductCreateDTO
    {
        [Required]
        public string Title { get; set; } = null!;
        public string Description { get; set; }
        [Required]
        [Range(0.01,double.MaxValue,ErrorMessage ="Price Must Be Greater Than 0")]
        public decimal Price { get; set; }
        public string ProductImage { get; set; }
        [Required]
        [Range(0,int.MaxValue,ErrorMessage ="Quantity cannot be negative")]
        public int Quantity { get; set; } 
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public int BrandId { get; set; }
        [Range(0,double.MaxValue,ErrorMessage ="Discount cannot be Negative")]
        public decimal Discount { get; set; } = 0;

    }
}
