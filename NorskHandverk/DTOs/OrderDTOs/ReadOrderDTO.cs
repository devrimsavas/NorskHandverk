namespace NorskHandverk.DTOs.OrderDTOs
{
    public class ReadOrderDTO
    {
        public string OrderNumber { get; set; }
        public string StatusName { get; set; }
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; }

        //items
        public ICollection<ReadOrderItemDTO> Items { get; set; }

        //price
        public decimal TotalPrice { get; set; }
        public decimal TotalPriceIncVat { get; set; }
    }
}
