using NorskHandverk.Models.ProductModels;

namespace NorskHandverk.Tests;

public class PricingTests
{
    // Builds a product in memory, no database needed
    private static Product CreateProduct(decimal price, decimal discount, decimal vatRate)
    {
        return new Product
        {
            Title = "Test product",
            Price = price,
            Discount = discount,
            Category = new Category { Name = "Test category", DefaultVatRate = vatRate }
        };
    }

    [Fact]
    public void PriceIncVat_WithoutDiscount_AddsVatToPrice()
    {
        var product = CreateProduct(price: 400m, discount: 0m, vatRate: 0.25m);

        Assert.Equal(500m, product.PriceIncVat);
    }

    [Fact]
    public void PriceIncVat_WithDiscount_CalculatesVatOnDiscountedPrice()
    {
        // (850 - 50) * 1.25 = 1000, the cutting board in the shop
        var product = CreateProduct(price: 850m, discount: 50m, vatRate: 0.25m);

        Assert.Equal(1000m, product.PriceIncVat);
    }

    [Theory]
    [InlineData(0.25, 125)]
    [InlineData(0.15, 115)]
    [InlineData(0.12, 112)]
    [InlineData(0.0, 100)]
    public void PriceIncVat_UsesTheCategoryVatRate(double vatRate, double expected)
    {
        var product = CreateProduct(price: 100m, discount: 0m, vatRate: (decimal)vatRate);

        Assert.Equal((decimal)expected, product.PriceIncVat);
    }
}