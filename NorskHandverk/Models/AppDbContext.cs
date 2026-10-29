using Microsoft.EntityFrameworkCore;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.Models.OrderModels;
using NorskHandverk.Models.CartModels;
using NorskHandverk.Models.TransactionModels;

namespace NorskHandverk.Models
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { } 
        //Product 
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands {  get; set; }
        public DbSet<Product> Products { get; set; }
        //Customer 
        public DbSet<Customer> Customers { get; set; }
        public DbSet<MemberShipStatus> MembershipStatuses { get; set; }
        //Order 
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }
        //Cart 
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }  
        public DbSet<CartStatus> CartStatuses { get; set; }

        //Transaction 
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionMethod> TransactionMethods { get; set; }
        public DbSet<TransactionProvider> TransactionProviders { get; set; }    
        public DbSet<TransactionStatus> TransactionStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Category-Product 
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict) //cascade disabled not to deleted products
                .IsRequired();
            //Category-Brand 
            modelBuilder.Entity<Brand>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Brand)
                .HasForeignKey(p=>p.BrandId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();
            //Product has precision
           
            modelBuilder.Entity<Product>()
                .Property(p => p.Discount)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Product>()
                .Property(p => p.DateAdded)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<Category>()
                .Property(c => c.DefaultVatRate)
                .HasPrecision(5, 2);
            //product price has precision
            modelBuilder.Entity<Product>()
                .Property (c => c.Price)
                .HasPrecision(18, 2);    

            //unique email for customer
            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<Customer>()
                .HasOne(c => c.MemberShipStatus)
                .WithMany()
                .HasForeignKey(c => c.MemberShipStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            //membership status 
            modelBuilder.Entity<MemberShipStatus>()
            .HasData(
            new MemberShipStatus { Id = (int)MemberShipStatusType.Silver, Name = "Silver" },
            new MemberShipStatus { Id = (int)MemberShipStatusType.Gold, Name = "Gold" },
            new MemberShipStatus { Id = (int)MemberShipStatusType.Platinum, Name = "Platinum" }
            );

            //Order-Status 
            modelBuilder.Entity<OrderStatus>()
                .HasData(
                new OrderStatus { Id = (int)OrderStatusType.Canceled, Name = "Canceled" },
                new OrderStatus { Id = (int)OrderStatusType.Ordered, Name = "Ordered" },
                new OrderStatus { Id = (int)OrderStatusType.InProgress, Name = "In Progress" },
                new OrderStatus { Id = (int)OrderStatusType.Delivered, Name = "Delivered" },
                new OrderStatus { Id = (int)OrderStatusType.AwaitingPayment, Name = "Awaiting Payment" }
                );

            //Order-Customer 
            modelBuilder.Entity<Order>() 
                .HasOne(o=>o.Customer)
                .WithMany(c=>c.Orders)
                .HasForeignKey(o=>o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasMany(o=>o.Items)
                .WithOne(i=>i.Order)
                .HasForeignKey(i=>i.OrderId)
                .OnDelete(DeleteBehavior.Restrict); 
            modelBuilder.Entity<OrderItem>()
                .HasOne(o=>o.Product)
                .WithMany()
                .HasForeignKey(oi=>oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);


            //Cart-Status 
            modelBuilder.Entity<CartStatus>()
                .HasData(
                new CartStatus { Id = (int)CartStatusType.Active, Name = "active" },
                new CartStatus { Id = (int)CartStatusType.CheckedOut, Name = "checkedOut" },
                new CartStatus { Id = (int)CartStatusType.Abandoned, Name = "abandoned" },
                new CartStatus { Id = (int)CartStatusType.Completed, Name = "completed" }
                );


            //Cart -Customer 
            modelBuilder.Entity<Cart>()
                .HasOne(c=>c.Customer)
                .WithMany()
                .HasForeignKey(c=>c.CustomerId)   
                .OnDelete(DeleteBehavior.Restrict);
                
               
            //Cart-CartItem
            modelBuilder.Entity<Cart>()
                .HasMany(ci=>ci.Items)
                .WithOne(i=>i.Cart)
                .HasForeignKey(c=>c.CartId)
                .OnDelete(DeleteBehavior.Restrict);
            //CartItem-Product
            modelBuilder.Entity<CartItem>()
                .HasOne(c=>c.Product)
                .WithMany()
                .HasForeignKey(c=>c.ProductId)
                .OnDelete (DeleteBehavior.Restrict);
            //Cart-CartStatus 
            modelBuilder.Entity<Cart>()
                .HasOne(c=>c.CartStatus)
                .WithMany()
                .HasForeignKey (c=>c.CartStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            //Transaction Amount precision
            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);

            //Transaction- TransactionMethod
            modelBuilder.Entity<Transaction>()
                 .HasOne(t => t.TransactionMethod)
                 .WithMany()
                 .HasForeignKey(t => t.TransactionMethodId)
                 .OnDelete(DeleteBehavior.Restrict);


            //Transaction-TransactionProvider
            modelBuilder.Entity<Transaction>()
                .HasOne(t=>t.TransactionProvider)
                .WithMany()
                .HasForeignKey(t=>t.TransactionProviderId)
                .OnDelete(DeleteBehavior.Restrict);

            //Transaction-TransactionStatus
            modelBuilder.Entity<Transaction>()
                .HasOne(t=>t.TransactionStatus)
                .WithMany()
                .HasForeignKey(t=>t.TransactionStatusId)
                .OnDelete(DeleteBehavior.Restrict);
            //TransactionMethod populate with well-known methods
            modelBuilder.Entity<TransactionMethod>()
                .HasData(
                new TransactionMethod { Id = (int)TransactionMethodType.Card, Method = "card" },
                new TransactionMethod { Id = (int)TransactionMethodType.Vipps, Method = "vipps" },
                new TransactionMethod { Id = (int)TransactionMethodType.Cash, Method = "kontant" }
                );

            //TransactionStatus populate 
            modelBuilder.Entity<TransactionStatus>()
            .HasData(
            new TransactionStatus { Id = (int)TransactionStatusType.Pending, Status = "pending" },
            new TransactionStatus { Id = (int)TransactionStatusType.Success, Status = "success" },
            new TransactionStatus { Id = (int)TransactionStatusType.Failed, Status = "failed" },
            new TransactionStatus { Id = (int)TransactionStatusType.Canceled, Status = "canceled" }
            );

            //Transaction Provider 
            modelBuilder.Entity<TransactionProvider>()
            .HasData(
            new TransactionProvider { Id = (int)TransactionProviderType.Stripe, Name = "Stripe" },
            new TransactionProvider { Id = (int)TransactionProviderType.GooglePay, Name = "Google Pay" },
            new TransactionProvider { Id = (int)TransactionProviderType.Vipps, Name = "Vipps" },
            new TransactionProvider { Id = (int)TransactionProviderType.Klarna, Name = "Klarna" },
            new TransactionProvider { Id = (int)TransactionProviderType.Nets, Name = "Nets" },
            new TransactionProvider { Id = (int)TransactionProviderType.Manual, Name = "Manual" }
            );





















        }

    }
}
