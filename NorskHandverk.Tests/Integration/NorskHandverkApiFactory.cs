using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NorskHandverk.Models;
using NorskHandverk.Services;
using NorskHandverk.Tests.Fakes;

namespace NorskHandverk.Tests.Integration;

// Starts the real API in memory, against a separate test database and a fake payment service
public class NorskHandverkApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string AdminEmail = "admin@test.local";
    public const string AdminPassword = "AdminPass123";

    private readonly string _connectionString =
        Environment.GetEnvironmentVariable("TEST_DB_CONNECTION")
        ?? "Host=localhost;Port=5432;Database=norskhandverk_test;Username=postgres;Password=postgres";

    public FakePaymentService Payments { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        // UseSetting values are already visible while Program.cs builds the app
        builder.UseSetting("ConnectionStrings:DefaultConnection", _connectionString);
        builder.UseSetting("Jwt:SecretKey", "integration-tests-secret-key-that-is-long-enough-1234567890");
        builder.UseSetting("Jwt:Issuer", "NorskHandverk");
        builder.UseSetting("Jwt:Audience", "NorskHandverkClient");
        builder.UseSetting("Jwt:ExpiryMinutes", "60");
        builder.UseSetting("AdminUser:Email", AdminEmail);
        builder.UseSetting("AdminUser:Password", AdminPassword);
        builder.UseSetting("AdminUser:Name", "Test");
        builder.UseSetting("AdminUser:Surname", "Admin");

        builder.ConfigureServices(services =>
        {
            // Replace Stripe with the fake
            services.RemoveAll<IPaymentService>();
            services.AddSingleton<IPaymentService>(Payments);

            // The background job must not change carts while tests run
            var job = services.Single(d => d.ImplementationType == typeof(AbandonedCartJob));
            services.Remove(job);
        });
    }

    // Runs once before the tests: rebuild the test database from the migrations
    public async Task InitializeAsync()
    {
        if (!_connectionString.Contains("test", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("TEST_DB_CONNECTION must point to a test database, it is deleted on every run.");
        }

        var options = new DbContextOptionsBuilder<AppDbContext>().UseNpgsql(_connectionString).Options;
        await using var dbContext = new AppDbContext(options);
        await dbContext.Database.EnsureDeletedAsync();
        await dbContext.Database.MigrateAsync();
    }

    Task IAsyncLifetime.DisposeAsync() => base.DisposeAsync().AsTask();
}