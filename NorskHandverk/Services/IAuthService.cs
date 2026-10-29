using NorskHandverk.DTOs.AuthDTOs;
namespace NorskHandverk.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO request);
    }
}
 