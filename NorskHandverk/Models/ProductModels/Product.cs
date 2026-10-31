//Product.cs 

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace NorskHandverk.Models.ProductModels
{
    public enum Status
    {
        Available,
        Out_Of_Stock

    }
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Title { get; set; }=string.Empty;
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;
        [Required]
        public decimal Price { get; set; }
        public string ProductImage { get; set; }= string.Empty;

        // Discount is taken off the net price, VAT is calculated on the discounted price
        public decimal PriceIncVat => (Price - Discount) * (1 + Category.DefaultVatRate);
        [Required]
        public int Quantity { get; set; }
        public DateTime DateAdded { get; set; }
        public Status Status {  get; set; }=Status.Available;
        //soft delete
        public bool IsDeleted {  get; set; }=false;
        //discount  default 0
        public decimal Discount { get; set; } = 0.0m;
        //navigation Category         
        public Category Category { get; set; }
        [Required]        
        public int CategoryId { get; set; }
        //navigation Brand 
        
        public Brand Brand {  get; set; }
        [Required]
        public int BrandId { get; set; }
    }


}
