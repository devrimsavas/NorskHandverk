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
        public decimal DefaultVatRate { get; set; } = 0.25m;

        
    }
}
