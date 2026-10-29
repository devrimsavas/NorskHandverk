using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NorskHandverk.DTOs.AuthDTOs;
using NorskHandverk.Models;
using NorskHandverk.Models.AuthModels;
using NorskHandverk.Models.CustomerModels;

namespace NorskHandverk.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly JwtSettings _jwtSettings;

        public AuthService(AppDbContext dbContext, IOptions<JwtSettings> jwtOptions)
        {
            _dbContext = dbContext;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO request)
        {
            var customer = await _dbContext.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email && !c.IsDeleted);

            if (customer == null)
            {
                return null;
            }

            var hasher = new PasswordHasher<Customer>();
            var result = hasher.VerifyHashedPassword(customer, customer.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return null;
            }

            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

            return new LoginResponseDTO
            {
                Token = GenerateToken(customer, expiresAt),
                ExpiresAt = expiresAt,
                CustomerId = customer.Id,
                Name = customer.Name,
                Role = customer.Role.ToString()
            };
        }

        private string GenerateToken(Customer customer, DateTime expiresAt)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                new Claim(ClaimTypes.Email, customer.Email),
                new Claim(ClaimTypes.Name, customer.Name),
                new Claim(ClaimTypes.Role, customer.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}