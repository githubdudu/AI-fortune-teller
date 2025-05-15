using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapUserToDto);
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user != null ? MapUserToDto(user) : null;
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            return user != null ? MapUserToDto(user) : null;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserRequest request)
        {
            // Business validation could be added here
            // For example, check if username or email already exists

            var existingUserByEmail = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUserByEmail != null)
                throw new InvalidOperationException(
                    $"A user with email {request.Email} already exists."
                );

            var user = new User
            {
                Id = Guid.NewGuid(),
                // Username = request.Username,
                Email = request.Email,
                DisplayName = request.DisplayName,
                CreatedAt = DateTime.UtcNow,
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return MapUserToDto(user);
        }

        public async Task UpdateUserAsync(Guid id, CreateUserRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");

            // Check if another user already has the requested email
            var existingUserWithEmail = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUserWithEmail != null && existingUserWithEmail.Id != id)
                throw new InvalidOperationException(
                    $"Email {request.Email} is already registered."
                );

            // Update the user
            // user.Username = request.Username;
            user.Email = request.Email;
            user.DisplayName = request.DisplayName;
            user.DateOfBirth = request.DateOfBirth;
            user.Gender = request.Gender;
            user.ResidenceCountry = request.ResidenceCountry;
            user.BornCountry = request.BornCountry;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var exists = await _userRepository.ExistsAsync(id);
            if (!exists)
                return false;

            await _userRepository.DeleteAsync(id);
            await _userRepository.SaveChangesAsync();
            return true;
        }

        private static UserDto MapUserToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                // Username = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                ResidenceCountry = user.ResidenceCountry,
                BornCountry = user.BornCountry,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
            };
        }
    }
}
