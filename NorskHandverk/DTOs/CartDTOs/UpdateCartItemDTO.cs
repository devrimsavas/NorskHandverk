namespace NorskHandverk.DTOs.CartDTOs
{
    public class UpdateCartItemDTO
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int NewQuantity { get; set; }
    }
}
