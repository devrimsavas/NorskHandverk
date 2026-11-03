using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.ProductDTOs
{
    public class ProductReadDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public string ProductImage { get; set; }
        public string? ProductImageUrl { get; set; }
        public decimal PriceIncVat { get; set; }
        public int Quantity { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public DateTime DateAdded { get; set; }
        public string Status { get; set; }
        public bool IsDeleted { get; set; }


    }
}
