namespace NorskHandverk.Models.OrderModels
{
    // Business rules for how an admin can move an order forward
    public static class OrderStatusRules
    {
        private static readonly Dictionary<OrderStatusType, OrderStatusType> NextStatus = new()
        {
            { OrderStatusType.Ordered, OrderStatusType.InProgress },
            { OrderStatusType.InProgress, OrderStatusType.Delivered },
        };

        // True only for one step forward: Ordered -> InProgress -> Delivered
        public static bool CanMove(OrderStatusType from, OrderStatusType to)
        {
            return NextStatus.TryGetValue(from, out var allowed) && allowed == to;
        }
    }
}