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
    [Authorize]
    public class DailyFortunesController : ControllerBase
    {
        private readonly IDailyFortuneService _dailyFortuneService;

        public DailyFortunesController(IDailyFortuneService dailyFortuneService)
        {
            _dailyFortuneService = dailyFortuneService;
        }

        [HttpGet]
        public async Task<ActionResult<DailyFortuneDto>> GetDailyFortune()
        {
            //TODO: Review this to decide either to use JWT token or GetUserId
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized();
            }

            var result = await _dailyFortuneService.GetOrCreateDailyFortuneAsync(userId);
            return Ok(result);
        }
    }
}