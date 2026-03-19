namespace NorskHandverk.Services
{
    public interface IOrderService
    {
        Task UpdateORderAfterPayment(string paymentIntentId);
    }
}
