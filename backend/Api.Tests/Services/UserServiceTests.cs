using Api.Models.Domain;
using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Repositories.Interfaces;
using Api.Services.Implementations;
using Moq;
using Xunit;

namespace Api.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _userService = new UserService(_mockUserRepository.Object);
        }

        [Fact]
        public async Task GetAllUsersAsync_ReturnsAllUsers()
        {
            var users = new List<User>
            {
                new User { Id = Guid.NewGuid(), DisplayName = "user1", Email = "user1@example.com", CreatedAt = DateTime.UtcNow },
                new User { Id = Guid.NewGuid(), DisplayName = "user2", Email = "user2@example.com", CreatedAt = DateTime.UtcNow }
            };

            _mockUserRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(users);

            var result = await _userService.GetAllUsersAsync();

            Assert.Equal(2, result.Count());
            Assert.Equal(users[0].DisplayName, result.First().DisplayName);
            Assert.Equal(users[1].DisplayName, result.Last().DisplayName);
        }

        [Fact]
        public async Task GetUserByIdAsync_WithExistingId_ReturnsUser()
        {
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, DisplayName = "testuser", Email = "test@example.com", CreatedAt = DateTime.UtcNow };

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync(user);

            var result = await _userService.GetUserByIdAsync(userId);

            Assert.NotNull(result);
            Assert.Equal(userId, result.Id);
            Assert.Equal("testuser", result.DisplayName);
            Assert.Equal("test@example.com", result.Email);
        }

        [Fact]
        public async Task GetUserByIdAsync_WithNonExistingId_ReturnsNull()
        {
            var userId = Guid.NewGuid();

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);

            var result = await _userService.GetUserByIdAsync(userId);

            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserByEmailAsync_WithExistingEmail_ReturnsUser()
        {
            var email = "test@example.com";
            var user = new User { Id = Guid.NewGuid(), DisplayName = "testuser", Email = email, CreatedAt = DateTime.UtcNow };

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(email))
                .ReturnsAsync(user);

            var result = await _userService.GetUserByEmailAsync(email);

            Assert.NotNull(result);
            Assert.Equal(email, result.Email);
            Assert.Equal("testuser", result.DisplayName);
        }

        [Fact]
        public async Task GetUserByEmailAsync_WithNonExistingEmail_ReturnsNull()
        {
            var email = "nonexisting@example.com";

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(email))
                .ReturnsAsync((User?)null);

            var result = await _userService.GetUserByEmailAsync(email);

            Assert.Null(result);
        }

        [Fact]
        public async Task CreateUserAsync_WithValidRequest_CreatesAndReturnsUser()
        {
            var request = new CreateUserRequest { DisplayName = "newuser", Email = "new@example.com" };

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync((User?)null);

            User? capturedUser = null;

            _mockUserRepository.Setup(repo => repo.AddAsync(It.IsAny<User>()))
                .Callback<User>(user =>
                {
                    capturedUser = user;
                    Assert.Equal(request.DisplayName, user.DisplayName);
                    Assert.Equal(request.Email, user.Email);
                    Assert.NotEqual(Guid.Empty, user.Id);
                    Assert.True(DateTime.UtcNow.Subtract(user.CreatedAt).TotalSeconds < 5);
                })
                .ReturnsAsync((User user) => user);

            var result = await _userService.CreateUserAsync(request);

            Assert.NotNull(result);
            Assert.Equal(request.DisplayName, result.DisplayName);
            Assert.Equal(request.Email, result.Email);
            Assert.NotNull(capturedUser);
            Assert.Equal(capturedUser!.Id, result.Id);
            _mockUserRepository.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Once);
            _mockUserRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateUserAsync_WithExistingEmail_ThrowsInvalidOperationException()
        {
            var request = new CreateUserRequest { DisplayName = "newuser", Email = "existing@example.com" };
            var existingUser = new User { Id = Guid.NewGuid(), DisplayName = "existinguser", Email = request.Email };

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync(existingUser);

            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _userService.CreateUserAsync(request));
            Assert.Contains(request.Email, exception.Message);
        }

        [Fact]
        public async Task UpdateUserAsync_WithValidRequest_UpdatesUser()
        {
            var userId = Guid.NewGuid();
            var request = new CreateUserRequest
            {
                DisplayName = "updateduser",
                Email = "updated@example.com",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = 1,
                ResidenceCountry = "US",
                BornCountry = "US"
            };

            var existingUser = new User
            {
                Id = userId,
                DisplayName = "oldname",
                Email = "old@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            };

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync((User?)null);

            await _userService.UpdateUserAsync(userId, request);

            _mockUserRepository.Verify(repo => repo.UpdateAsync(It.Is<User>(u =>
                u.Id == userId &&
                u.DisplayName == request.DisplayName &&
                u.Email == request.Email &&
                u.DateOfBirth == request.DateOfBirth &&
                u.Gender == request.Gender &&
                u.ResidenceCountry == request.ResidenceCountry &&
                u.BornCountry == request.BornCountry &&
                u.UpdatedAt != null
            )), Times.Once);

            _mockUserRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateUserAsync_WithNonExistingId_ThrowsKeyNotFoundException()
        {
            var userId = Guid.NewGuid();
            var request = new CreateUserRequest { DisplayName = "updateduser", Email = "updated@example.com" };

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);

            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _userService.UpdateUserAsync(userId, request));
            Assert.Contains(userId.ToString(), exception.Message);
        }

        [Fact]
        public async Task UpdateUserAsync_WithDuplicateEmail_ThrowsInvalidOperationException()
        {
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();
            var request = new CreateUserRequest { DisplayName = "updateduser", Email = "duplicate@example.com" };

            var existingUser = new User { Id = userId, DisplayName = "oldname", Email = "old@example.com" };
            var duplicateUser = new User { Id = otherUserId, DisplayName = "otheruser", Email = request.Email };

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync(duplicateUser);

            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _userService.UpdateUserAsync(userId, request));
            Assert.Contains(request.Email, exception.Message);
        }

        [Fact]
        public async Task DeleteUserAsync_WithExistingId_DeletesUserAndReturnsTrue()
        {
            var userId = Guid.NewGuid();

            _mockUserRepository.Setup(repo => repo.ExistsAsync(userId))
                .ReturnsAsync(true);

            var result = await _userService.DeleteUserAsync(userId);

            Assert.True(result);
            _mockUserRepository.Verify(repo => repo.DeleteAsync(userId), Times.Once);
            _mockUserRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteUserAsync_WithNonExistingId_ReturnsFalse()
        {
            var userId = Guid.NewGuid();

            _mockUserRepository.Setup(repo => repo.ExistsAsync(userId))
                .ReturnsAsync(false);

            var result = await _userService.DeleteUserAsync(userId);

            Assert.False(result);
            _mockUserRepository.Verify(repo => repo.DeleteAsync(userId), Times.Never);
            _mockUserRepository.Verify(repo => repo.SaveChangesAsync(), Times.Never);
        }
    }
}