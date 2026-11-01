using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.CategoryDTOs
{
    public class CreateCategoryDTO
    {
        [Required]
        [MaxLength(50)]

        public string Name { get; set; } = null!;
        [Required]
        [MaxLength(250)]
        public string Description { get; set; } = null!;

        public string? UcpCategoryCode { get; set; }

        //VAT 15% food default 25%
        // VAT as a fraction: 0.25 means 25%
        [Range(0, 1, ErrorMessage = "VAT rate must be between 0 and 1, for example 0.25 for 25%.")]
        public decimal DefaultVatRate { get; set; } = 0.25m;

        
    }
}
