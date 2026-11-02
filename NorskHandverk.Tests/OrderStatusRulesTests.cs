using NorskHandverk.Models.OrderModels;

namespace NorskHandverk.Tests;

public class OrderStatusRulesTests
{
    [Theory]
    [InlineData(OrderStatusType.Ordered, OrderStatusType.InProgress)]
    [InlineData(OrderStatusType.InProgress, OrderStatusType.Delivered)]
    public void CanMove_OneStepForward_IsAllowed(OrderStatusType from, OrderStatusType to)
    {
        Assert.True(OrderStatusRules.CanMove(from, to));
    }

    [Theory]
    // Skipping a step
    [InlineData(OrderStatusType.Ordered, OrderStatusType.Delivered)]
    // Going back
    [InlineData(OrderStatusType.Delivered, OrderStatusType.InProgress)]
    [InlineData(OrderStatusType.InProgress, OrderStatusType.Ordered)]
    // Unpaid orders cannot be prepared
    [InlineData(OrderStatusType.AwaitingPayment, OrderStatusType.InProgress)]
    // Cancellation goes through the cancel endpoint, so the payment is refunded
    [InlineData(OrderStatusType.Ordered, OrderStatusType.Canceled)]
    // A canceled order stays canceled
    [InlineData(OrderStatusType.Canceled, OrderStatusType.Ordered)]
    public void CanMove_AnyOtherChange_IsRejected(OrderStatusType from, OrderStatusType to)
    {
        Assert.False(OrderStatusRules.CanMove(from, to));
    }
}