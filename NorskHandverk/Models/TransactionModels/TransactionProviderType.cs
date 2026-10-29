namespace NorskHandverk.Models.TransactionModels
{
    // Values must match the seeded Ids in AppDbContext (TransactionProvider HasData)
    public enum TransactionProviderType
    {
        Stripe = 1,
        GooglePay = 2,
        Vipps = 3,
        Klarna = 4,
        Nets = 5,
        Manual = 6
    }
}