using System.ComponentModel.DataAnnotations;
namespace NorskHandverk.DTOs.OrderDTOs
{
    public class UpdateOrderStatusDTO
    {
        // "InProgress" or "Delivered"
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
