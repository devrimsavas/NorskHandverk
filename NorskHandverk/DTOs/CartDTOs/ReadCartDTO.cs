using System.ComponentModel.DataAnnotations;
using NorskHandverk.DTOs.CartDTOs;
namespace NorskHandverk.DTOs.CartDTOs
{
    public class ReadCartDTO
    {
        public string CartNumber { get; set; }
        public int CustomerId { get; set; }
        public string StatusName { get; set; }
        public List<ReadCartItemDTO> Items { get; set; }

    }
}
