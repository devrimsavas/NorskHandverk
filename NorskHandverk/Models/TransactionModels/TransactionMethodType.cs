namespace NorskHandverk.Models.TransactionModels
{
    // Values must match the seeded Ids in AppDbContext (TransactionMethod HasData)
    public enum TransactionMethodType
    {
        Card = 1,
        Vipps = 2,
        Cash = 3
    }
}