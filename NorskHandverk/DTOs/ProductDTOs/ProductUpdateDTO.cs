using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.ProductDTOs
{
    public class ProductUpdateDTO
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal?  Price { get; set; }

        public string? ProductImage { get; set; }
        public int? Quantity { get; set; }
        
        
        public bool? IsDeleted { get; set; }
        public decimal? Discount { get; set; }
        public int?  CategoryId  {  get; set; }
        public int?  BrandId { get; set; }
    }
}
