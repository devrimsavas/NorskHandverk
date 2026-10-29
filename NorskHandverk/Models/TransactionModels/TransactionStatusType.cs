namespace NorskHandverk.Models.TransactionModels
{
    // Values must match the seeded Ids in AppDbContext (TransactionStatus HasData)
    public enum TransactionStatusType
    {
        Pending = 1,
        Success = 2,
        Failed = 3,
        Canceled = 4,
        Refunded=5

    }
}