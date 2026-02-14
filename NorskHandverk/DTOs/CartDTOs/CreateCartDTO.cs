namespace NorskHandverk.DTOs.CartDTOs
{
    public class CreateCartDTO
    {
        public int CustomerId { get; set; }
        //get from CreateCartItemDTO 
        public CreateCartItemDTO CartItem { get; set; }




    }
}
