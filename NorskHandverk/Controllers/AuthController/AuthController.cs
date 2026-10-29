using Microsoft.AspNetCore.Mvc;
using NorskHandverk.DTOs.AuthDTOs;
using NorskHandverk.Services;

namespace NorskHandverk.Controllers.AuthController
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginRequestDTO request)
        {
            var response = await _authService.LoginAsync(request);

            if (response == null)
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            return Ok(response);
        }
    }
}