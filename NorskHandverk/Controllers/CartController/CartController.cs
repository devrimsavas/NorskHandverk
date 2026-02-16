using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NorskHandverk.Models;
using NorskHandverk.Models.CartModels;
using NorskHandverk.DTOs.CartDTOs;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.Mappings;
using AutoMapper;

namespace NorskHandverk.Controllers.CartController
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CartController:ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public CartController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        //GET ALL CARTS
        [HttpGet]
        public async Task<ActionResult<ICollection<ReadCartDTO>>> GetCarts()
        {
            var carts=await _dbContext.Carts.Include(c=>c.CartStatus).Include(c=>c.Customer).Include(c=>c.Items).ToListAsync();  
            var readDTos=_mapper.Map<ICollection<ReadCartDTO>>(carts);
            return Ok(readDTos);

        }
        //GET ALL ACTIVE CARTS
        [HttpGet("active")]
        public async Task<ActionResult<ICollection<ReadCartDTO>>> GetActiveCarts()
        {
            var activeCarts=await _dbContext.Carts.Include(c=>c.CartStatus).Include(c=>c.Customer).Include(c=>c.Items).Where(c=>c.CartStatus.Name=="active").ToListAsync();
            var readDTos = _mapper.Map<ICollection<ReadCartDTO>>(activeCarts);
            return Ok(readDTos);
        }
        //GET CART BY ID
        [HttpGet("active/{id}")] 
        public async Task<ActionResult<ReadCartDTO>> GetCartById(int id)
        {
            var cart = await _dbContext.Carts.Include(c => c.CartStatus).Include(c=>c.Items).Include(c => c.Customer).FirstOrDefaultAsync(c=>c.Id==id);   
            if (cart==null)
            {
                return NotFound(new { Message = "Cart Does not exist" });
            }
            var readDTO = _mapper.Map<ReadCartDTO>(cart);
            return Ok(readDTO);

        }
        //GET CART BY CUSTOMER ID 
        [HttpGet("customer/{id}")]
        public async Task<ActionResult<ICollection<ReadCartDTO>>> GetCartByCustomerId(int id)
        {
            //check customer exist 
            var customer=await _dbContext.Customers.FirstOrDefaultAsync(c=>c.Id == id);
            if (customer == null)
            {
                return BadRequest(new { Message = "Customer does not exist" });
            }
            var customerCart=await _dbContext.Carts.Include(c=>c.CartStatus).Include(c=>c.Customer).Where(c=>c.CustomerId==id).ToListAsync();

            var readDTO=_mapper.Map<ICollection<ReadCartDTO>>(customerCart);
            return Ok(readDTO);
        }


        //CREATE CART 
        [HttpPost]
        public async Task<ActionResult<ReadCartDTO>> CreateCart(CreateCartDTO createCartDTO)
        {
            //empty object for DTO return 
            Cart cartToReturn = null;

            //product check
            var product = await _dbContext.Products.Include(p=>p.Category).FirstOrDefaultAsync(p=>p.Id==createCartDTO.CartItem.ProductId);
            if (product == null) return NotFound("Product does not exist");
            //stock control
            if (product.Quantity<createCartDTO.CartItem.Quantity)
            {
                return BadRequest($"Insufficient Stock, avaiable {product.Quantity}");
            }
            //decrease from stock 
            product.Quantity-=createCartDTO.CartItem.Quantity;
            if (product.Quantity==0)
            {
                product.Status = Status.Out_Of_Stock;
            }


            var existedCart=await _dbContext.Carts.Include(c=>c.Items).FirstOrDefaultAsync(c=>c.Customer.Id==createCartDTO.CustomerId && c.CartStatus.Name=="active");

            //if customer has already a cart products will be added to this cart
            if (existedCart!= null)
            {
                //create a new cartITem 
                //cart item exists only increase quantity
                var existedItem = existedCart.Items.FirstOrDefault(x => x.ProductId == createCartDTO.CartItem.ProductId);
                if (existedItem != null)
                {
                    existedItem.Quantity += createCartDTO.CartItem.Quantity;
                }
                else
                {
                    //cart item does not exist
                    var newItem = new CartItem
                    {
                        ProductId = product.Id,
                        ProductName = product.Title,
                        UnitPrice = product.Price,
                        VatRate = product.Category.DefaultVatRate,
                        Quantity = createCartDTO.CartItem.Quantity,
                        CartId = existedCart.Id

                    };
                    existedCart.Items.Add(newItem);
                }
                //return reference existedCart
                cartToReturn=existedCart;

            }
            //create new cart
            else
            {
                //check cart active status 
                var activeStatus=await _dbContext.CartStatuses.FirstOrDefaultAsync(s=>s.Name=="active");
                var newCart = new Cart
                {
                    CustomerId = createCartDTO.CustomerId,
                    CartStatusId = activeStatus.Id,
                    CartNumber = "CRT-" + DateTime.Now.Ticks,
                    Items=new List<CartItem>()
                };
                //add first item
                var firstItem = new CartItem
                {
                    ProductId = product.Id,
                    ProductName = product.Title,
                    UnitPrice = product.Price,
                    VatRate = product.Category.DefaultVatRate,
                    Quantity = createCartDTO.CartItem.Quantity,

                };
                newCart.Items.Add(firstItem);
                //add to db
                _dbContext.Carts.Add(newCart);
                //return DTO is new cart
                cartToReturn = newCart;

            }
            //save changing 
            await _dbContext.SaveChangesAsync();
            //return referense DTO 
            var readDTO=_mapper.Map<ReadCartDTO>(cartToReturn);
            return Ok(readDTO);

        }
        //REMOVE ITEM FROM EXISTED CART 
        [HttpPost("removeitem")]

        public async Task<ActionResult<ReadCartDTO>> RemoveItem(RemoveCartItemDTO removeCartItemDTO )
        {
            //find existed cart
            var existedCart=await _dbContext.Carts.Include(c=>c.CartStatus).Include(c=>c.Items).ThenInclude(i=>i.Product).FirstOrDefaultAsync(c=>c.CustomerId==removeCartItemDTO.CustomerId && c.CartStatus.Name=="active");
            if (existedCart==null)
            {
                return NotFound(new { Message = "Active cart not found" });
            }
            //item
            var itemToRemove=existedCart.Items.FirstOrDefault(i=>i.ProductId==removeCartItemDTO.ProductId);
            if (itemToRemove == null)
            {
                return NotFound(new { Message = "Item not found in cart" });
            }
            //quantity check
            //more than existed cart
            if (itemToRemove.Quantity<removeCartItemDTO.QuantityToRemove)
            {
                return BadRequest(new { Message = $"You can remove maximum  {itemToRemove.Quantity} of item: ${itemToRemove.ProductName}" });

            }
            //same amount delete item
            else if (itemToRemove.Quantity==removeCartItemDTO.QuantityToRemove)
            {
                //add to stock
                itemToRemove.Product.Quantity += removeCartItemDTO.QuantityToRemove;
                //stock status
                itemToRemove.Product.Status = Status.Available;
                //remove from Cart
                _dbContext.CartItems.Remove(itemToRemove);


            }
            //quantity to remove is less than quantity in cart 
            else
            {

                //remove amount from cart 
                itemToRemove.Product.Quantity += removeCartItemDTO.QuantityToRemove;
                //status check 
                itemToRemove.Product.Status=Status.Available;   
                //remove amount from cart
                itemToRemove.Quantity-=removeCartItemDTO.QuantityToRemove;

            }
            //save 
            await _dbContext.SaveChangesAsync();
            //return existed cart update
            var readDTO=_mapper.Map<ReadCartDTO>(existedCart);
            return Ok(readDTO);

        }

        //CLEAR CART 
        [HttpPost("clearcart/{customerId}")]
        public async Task<ActionResult<ReadCartDTO>> ClearCart(int customerId)
        {
            //find cart
            var cart = await _dbContext.Carts.Include(c => c.CartStatus).Include(c => c.Items).ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId && c.CartStatus.Name == "active");

            //check 
            if (cart==null)
            {
                return NotFound(new { Message = "Cart does not exist" });
            }
            //iterate and find products and add to stock 
            foreach (var item in cart.Items)
            {
                int quantity=item.Quantity;
                //added to stock products
                item.Product.Quantity += quantity;
                //status 
                item.Product.Status=Status.Available;                
            }
            //remove all items from cart
            _dbContext.CartItems.RemoveRange(cart.Items); 
            await _dbContext.SaveChangesAsync();
            //return dto 
            var readDTO = _mapper.Map<ReadCartDTO>(cart);

            return Ok(readDTO);
        }
        //UPDATE CART 
        [HttpPost("updatecart")]
        public async Task<ActionResult<ReadCartDTO>> UpdateCart(UpdateCartItemDTO updateCartItemDTO)
        {
            //find cart 
            var cart = await _dbContext.Carts.Include(c => c.CartStatus).Include(c => c.Items).ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == updateCartItemDTO.CustomerId && c.CartStatus.Name=="active");
            if (cart == null) 
            {
                return NotFound(new { Message = "Cart does not exist" });
            };
            var product=cart.Items.FirstOrDefault(c=>c.ProductId==updateCartItemDTO.ProductId);
            if (product == null)
            {
                return NotFound(new { Message = "Item not found in your cart" });
            }
            //existed quantity;
            var existedQuantity=product.Quantity;
            //delta + for add - for remove items 
            var delta = updateCartItemDTO.NewQuantity - existedQuantity;
            if (delta > 0)
            {
                //stock check 
                if (product.Product.Quantity<delta)
                {
                    return BadRequest(new { Message = "Not enough stock available" });
                }
                //stock 
                product.Product.Quantity -= delta; // removed items from stock 

            }
            else if (delta<0)
            {
                product.Product.Quantity -= delta;
                //product avaiable 
                product.Product.Status = Status.Available;
            }
            //update customer cart
            product.Quantity = updateCartItemDTO.NewQuantity;
            //remove item
            if (product.Quantity ==0)
            {
                _dbContext.CartItems.Remove(product);

            }
            await _dbContext.SaveChangesAsync();
            var readDTO=_mapper.Map<ReadCartDTO>(cart);

            return Ok(readDTO);
            



        }





    }
}
