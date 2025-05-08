using Api.Models.DTOs;
using Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    // [Authorize]
    public class DailyFortunesController : ControllerBase
    {
        private readonly IDailyFortuneService _dailyFortuneService;
        private readonly IUserService _userService;

        public DailyFortunesController(IDailyFortuneService dailyFortuneService, IUserService userService)
        {
            _dailyFortuneService = dailyFortuneService;
            _userService = userService;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<DailyFortuneDto>> GetDailyFortune()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { message = "User email not found in token" });
            }

            var user = await _userService.GetUserByEmailAsync(userEmail);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            var result = await _dailyFortuneService.GetOrCreateDailyFortuneByEmailAsync(userEmail);
            return Ok(result);
        }
    }
}