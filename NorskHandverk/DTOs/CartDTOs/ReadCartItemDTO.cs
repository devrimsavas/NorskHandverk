namespace NorskHandverk.DTOs.CartDTOs
{
    public class ReadCartItemDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal VatRate {  get; set; }
        public int Quantity { get; set; }

        public decimal TotalPrice => UnitPrice * Quantity;
        public decimal TotalPriceIncVat => TotalPrice + (TotalPrice * VatRate);
    }
}
