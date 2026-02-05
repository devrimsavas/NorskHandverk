using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.ProductDTOs
{
    public class ProductReadDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } 
        public string Description { get; set; }

        public decimal Price { get; set; }
        public string ProductImage { get; set; }
        public decimal PriceIncVat { get; set; }
        public int Quantity { get; set; }
        public string CategoryName { get; set; }
        public string BrandName { get; set; }
        public DateTime DateAdded { get; set; }
        public string Status { get; set; }
        public bool IsDeleted { get; set; }


    }
}
