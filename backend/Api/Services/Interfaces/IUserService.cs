using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Models.Requests;

namespace Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(Guid id);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<UserDto?> GetUserByUsernameAsync(string username);
        Task<UserDto> CreateUserAsync(CreateUserRequest request);
        Task UpdateUserAsync(Guid id, CreateUserRequest request);
        Task<bool> DeleteUserAsync(Guid id);
    }
}
