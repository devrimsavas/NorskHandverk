using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.CategoryDTOs
{
    public class UpdateCategoryDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        [Range(0, 1, ErrorMessage = "VAT rate must be between 0 and 1, for example 0.25 for 25%.")]
        public decimal? DefaultVatRate { get; set; }
        public string? UcpCategoryCode { get; set; }
        

    }
}
