using Microsoft.EntityFrameworkCore;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.Models.OrderModels;
using NorskHandverk.Models.CartModels;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Category-Product 
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict) //cascade disabled not to deleted products
                .IsRequired();
            modelBuilder.Entity<Brand>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Brand)
                .HasForeignKey(p=>p.BrandId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Product>()
                .Property(p => p.Discount)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Product>()
                .Property(p => p.DateAdded)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<Category>()
                .Property(c => c.DefaultVatRate)
                .HasPrecision(5, 4);

            //unique email for customer
            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.MemberShipStatus)
                .WithMany()
                .HasForeignKey(c => c.MemberShipStatusId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<MemberShipStatus>()
                .HasData(
                new MemberShipStatus { Id=1,Name="Silver"},

                new MemberShipStatus { Id=2,Name="Gold"},
                new MemberShipStatus { Id=3, Name="Platinum"}
                );
            modelBuilder.Entity<OrderStatus>()
                .HasData(
                new OrderStatus { Id = 1, Name = "Canceled" },
                new OrderStatus { Id = 2, Name = "Ordered" },
                new OrderStatus { Id = 3, Name = "In Progress" },
                new OrderStatus { Id = 4, Name = "Delivered" }
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
                




            

                


                
            


              
                
                
                
                

        }

    }
}
