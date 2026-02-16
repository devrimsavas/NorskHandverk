namespace NorskHandverk.DTOs.CartDTOs
{
    public class RemoveCartItemDTO
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int QuantityToRemove { get; set; }
    }
}
