using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.BrandDTOs
{
    public class BrandCreateDTO
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; }
    }
}
