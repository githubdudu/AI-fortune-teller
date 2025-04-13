using Api.Models.Domain;
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
            // Arrange
            var users = new List<User>
            {
                new User { Id = Guid.NewGuid(), Username = "user1", Email = "user1@example.com", CreatedAt = DateTime.UtcNow },
                new User { Id = Guid.NewGuid(), Username = "user2", Email = "user2@example.com", CreatedAt = DateTime.UtcNow }
            };

            _mockUserRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(users);

            // Act
            var result = await _userService.GetAllUsersAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(users[0].Username, result.First().Username);
            Assert.Equal(users[1].Username, result.Last().Username);
        }

        [Fact]
        public async Task GetUserByIdAsync_WithExistingId_ReturnsUser()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Username = "testuser", Email = "test@example.com", CreatedAt = DateTime.UtcNow };

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync(user);

            // Act
            var result = await _userService.GetUserByIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.Id);
            Assert.Equal("testuser", result.Username);
        }

        [Fact]
        public async Task GetUserByIdAsync_WithNonExistingId_ReturnsNull()
        {
            // Arrange
            var userId = Guid.NewGuid();

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync((User)null);

            // Act
            var result = await _userService.GetUserByIdAsync(userId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateUserAsync_WithValidRequest_CreatesAndReturnsUser()
        {
            // Arrange
            var request = new CreateUserRequest { Username = "newuser", Email = "new@example.com" };

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync((User)null);
            _mockUserRepository.Setup(repo => repo.GetByUsernameAsync(request.Username))
                .ReturnsAsync((User)null);
            _mockUserRepository.Setup(repo => repo.AddAsync(It.IsAny<User>()))
                .ReturnsAsync((User user) => user);

            // Act
            var result = await _userService.CreateUserAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(request.Username, result.Username);
            Assert.Equal(request.Email, result.Email);
            _mockUserRepository.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Once);
            _mockUserRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateUserAsync_WithExistingEmail_ThrowsInvalidOperationException()
        {
            // Arrange
            var request = new CreateUserRequest { Username = "newuser", Email = "existing@example.com" };
            var existingUser = new User { Id = Guid.NewGuid(), Username = "existinguser", Email = request.Email };

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync(existingUser);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _userService.CreateUserAsync(request));
            Assert.Contains(request.Email, exception.Message);
        }

        [Fact]
        public async Task DeleteUserAsync_WithExistingId_DeletesUserAndReturnsTrue()
        {
            // Arrange
            var userId = Guid.NewGuid();

            _mockUserRepository.Setup(repo => repo.ExistsAsync(userId))
                .ReturnsAsync(true);

            // Act
            var result = await _userService.DeleteUserAsync(userId);

            // Assert
            Assert.True(result);
            _mockUserRepository.Verify(repo => repo.DeleteAsync(userId), Times.Once);
            _mockUserRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteUserAsync_WithNonExistingId_ReturnsFalse()
        {
            // Arrange
            var userId = Guid.NewGuid();

            _mockUserRepository.Setup(repo => repo.ExistsAsync(userId))
                .ReturnsAsync(false);

            // Act
            var result = await _userService.DeleteUserAsync(userId);

            // Assert
            Assert.False(result);
            _mockUserRepository.Verify(repo => repo.DeleteAsync(userId), Times.Never);
            _mockUserRepository.Verify(repo => repo.SaveChangesAsync(), Times.Never);
        }
    }
} 