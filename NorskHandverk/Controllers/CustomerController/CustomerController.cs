using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using NorskHandverk.DTOs.CustomerDTOs;
using NorskHandverk.Mappings;
using NorskHandverk.Models;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.Models.ProductModels;
using System.Security.Claims;


namespace NorskHandverk.Controllers.CustomerController
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CustomerController:ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public CustomerController(AppDbContext dbContext,IMapper mapper) 
        {
            _dbContext = dbContext;
            _mapper = mapper;
        
        }
        //GET ALL CUSTOMERS 
        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<ActionResult<ICollection<ReadCustomerDTO>>> GetCustomers()
        {
            var customers=await _dbContext.Customers.Include(c=>c.MemberShipStatus).ToListAsync();
            var results=_mapper.Map<IEnumerable<ReadCustomerDTO>>(customers);
            return Ok(results);
        }
        //GET CUSTOMER BY ID 
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")] 
        public async Task<ActionResult<ReadCustomerDTO>> GetCustomerById(int id )
        {
            var existedCustomer=await _dbContext.Customers.FirstOrDefaultAsync(c=>c.Id==id);
            if (existedCustomer == null)
            {
                return NotFound(new { Message = "Customer does not exist" });
            }
            var result=_mapper.Map<ReadCustomerDTO>(existedCustomer);
            return Ok(result);
        }

        //GET CURRENT CUSTOMER (from the JWT token)
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<ReadCustomerDTO>> GetCurrentCustomer()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idClaim, out var customerId))
            {
                return Unauthorized();
            }

            var customer = await _dbContext.Customers
                .Include(c => c.MemberShipStatus)
                .FirstOrDefaultAsync(c => c.Id == customerId && !c.IsDeleted);

            if (customer == null)
            {
                return NotFound(new { Message = "Customer does not exist" });
            }

            return Ok(_mapper.Map<ReadCustomerDTO>(customer));
        }

        //CREATE CUSTOMER 
        [HttpPost]
        public async Task<ActionResult<ReadCustomerDTO>> CreateCustomer(CreateCustomerDTO createCustomerDTO)
        {
            //check for customer exist
            var existedCustomer=await _dbContext.Customers.FirstOrDefaultAsync(c=>c.Email==createCustomerDTO.Email);
            if (existedCustomer!= null)
            {
                return Conflict(new { Message = $"Customer with email {createCustomerDTO.Email} already exists " });
            }
            //create first customer without password, hash and add 
            var newCustomer=_mapper.Map<Customer>(createCustomerDTO);
            var passwordHasher = new PasswordHasher<Customer>();
            //add hashed
            newCustomer.PasswordHash = passwordHasher.HashPassword(newCustomer, createCustomerDTO.Password);
            newCustomer.MemberShipStatusId = (int)MemberShipStatusType.Silver;
            //add
            _dbContext.Customers.Add(newCustomer);
            await _dbContext.SaveChangesAsync();    
            // result 
            var readDTO=_mapper.Map<ReadCustomerDTO>(newCustomer);
            return CreatedAtAction(nameof(GetCustomerById), new { id = readDTO.Id }, readDTO);

        }
        //UPDATE CUSTOMER 
        [Authorize(Roles = "Admin")]
        [HttpPut("{customerId}")]
        public async Task<ActionResult<ReadCustomerDTO>> UpdateCustomer(UpdateCustomerDTO updateCustomerDTO,int customerId)
        {
            //find existed user 
            var existedUser = await _dbContext.Customers.Include(c=>c.MemberShipStatus).FirstOrDefaultAsync(c => c.Id == customerId);
            if (existedUser==null)
            {
                return NotFound(new {Message="Customer is not found"});
            }
            //check email control 
            if (!string.IsNullOrEmpty(updateCustomerDTO.Email))
            {
                var emailInUse=await _dbContext.Customers.AnyAsync(c=>c.Email==updateCustomerDTO.Email && c.Id!=customerId);
                if ( emailInUse) 
                {
                    return Conflict(new { Message = "Email is already in use by another customer" });
                    
                }

            }
            //password
            if (!string.IsNullOrEmpty(updateCustomerDTO.Password))
            {
                var passwordHasher = new PasswordHasher<Customer>();
                existedUser.PasswordHash=passwordHasher.HashPassword(existedUser,updateCustomerDTO.Password);   
            }
            existedUser.Name = updateCustomerDTO.Name ?? existedUser.Name;
            existedUser.Surname=updateCustomerDTO.Surname ?? existedUser.Surname;
            existedUser.Email=updateCustomerDTO?.Email ?? existedUser.Email;
            existedUser.Address=updateCustomerDTO?.Address ?? existedUser.Address;
            existedUser.TelephoneNumber=updateCustomerDTO?.TelephoneNumber ?? existedUser.TelephoneNumber;

            
            await _dbContext.SaveChangesAsync();
            var readDTO=_mapper.Map<ReadCustomerDTO>(existedUser);
            return Ok(readDTO);


        }
        //SOFT DELETE 
        [Authorize(Roles = "Admin")]
        [HttpDelete("{customerId}")]
        public async Task<ActionResult<ReadCustomerDTO>> DeleteCustomer(int customerId)
        {
            //check id 
            var existedCustomer = await _dbContext.Customers.Include(c=>c.Orders).FirstOrDefaultAsync(c => c.Id == customerId);
            if (existedCustomer == null)
            {
                return NotFound(new { Message = "Customer does not exist" });
            }
            //check if customer has cart, order with product
            if (existedCustomer.Orders.Count!=0)
            {
                return Conflict(new { Message = "The customer has an order. Cannot be deleted " });
            }
            //soft delete
            existedCustomer.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
            var readDto=_mapper.Map<ReadCustomerDTO>(existedCustomer);
            return Ok(readDto);

        }

      

    }
}
