using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.CategoryDTOs
{
    public class UpdateCategoryDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? DefaultVatRate { get; set; }
        public string? UcpCategoryCode { get; set; }
        

    }
}
