using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NorskHandverk.Models;
using NorskHandverk.Models.CustomerModels;

namespace NorskHandverk.Data
{
    // Creates the first admin user on startup, using the "AdminUser" section in appsettings.json
    public static class AdminSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("AdminSeeder");

            // An admin already exists: nothing to do
            if (await dbContext.Customers.AnyAsync(c => c.Role == Role.Admin))
            {
                return;
            }

            var section = configuration.GetSection("AdminUser");
            var email = section["Email"];
            var password = section["Password"];

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                logger.LogWarning("No admin user exists and AdminUser settings are missing. Skipping admin seed.");
                return;
            }

            // Do not silently turn an existing customer into an admin
            if (await dbContext.Customers.AnyAsync(c => c.Email == email))
            {
                logger.LogWarning("A customer with email {Email} already exists. Skipping admin seed.", email);
                return;
            }

            var admin = new Customer
            {
                Name = section["Name"] ?? "Admin",
                Surname = section["Surname"] ?? "Admin",
                Email = email,
                Role = Role.Admin,
                Address = "N/A",
                TelephoneNumber = "N/A",
                MemberShipStatusId = (int)MemberShipStatusType.Silver
            };
            admin.PasswordHash = new PasswordHasher<Customer>().HashPassword(admin, password);

            dbContext.Customers.Add(admin);
            await dbContext.SaveChangesAsync();

            logger.LogInformation("Admin user {Email} created.", email);
        }
    }
}