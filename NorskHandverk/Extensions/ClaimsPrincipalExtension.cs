using System.Security.Claims;

namespace NorskHandverk.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        // Returns the customer id stored in the JWT token, or null if it is missing or invalid
        public static int? GetCustomerId(this ClaimsPrincipal user)
        {
            var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(idClaim, out var customerId) ? customerId : null;
        }
    }
}