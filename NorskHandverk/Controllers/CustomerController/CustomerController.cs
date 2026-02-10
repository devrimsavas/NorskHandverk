using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NorskHandverk.Models;
using NorskHandverk.Models.CustomerModels;
using NorskHandverk.Models.ProductModels;
using NorskHandverk.DTOs.CustomerDTOs;
using NorskHandverk.Mappings;
using AutoMapper;
using Microsoft.AspNetCore.Identity;


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
        [HttpGet]
        public async Task<ActionResult<ICollection<ReadCustomerDTO>>> GetCustomers()
        {
            var customers=await _dbContext.Customers.Include(c=>c.MemberShipStatus).ToListAsync();
            var results=_mapper.Map<IEnumerable<ReadCustomerDTO>>(customers);
            return Ok(results);
        }
        //GET CUSTOMER BY ID 
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
            newCustomer.MemberShipStatusId = 1;
            //add
            _dbContext.Customers.Add(newCustomer);
            await _dbContext.SaveChangesAsync();    
            // result 
            var readDTO=_mapper.Map<ReadCustomerDTO>(newCustomer);
            return CreatedAtAction(nameof(GetCustomerById), new { id = readDTO.Id }, readDTO);


        }
      

    }
}
