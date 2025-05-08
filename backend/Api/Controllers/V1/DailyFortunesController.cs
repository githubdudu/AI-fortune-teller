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
        //Test user's Guid
        private static readonly Guid UserId = new("11111111-1111-1111-1111-111111111111");

        public DailyFortunesController(IDailyFortuneService dailyFortuneService)
        {
            _dailyFortuneService = dailyFortuneService;
        }

        [HttpGet]
        public async Task<ActionResult<DailyFortuneDto>> GetDailyFortune()
        {
            //Commented out to use hardcoded test user's id
            // var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            // if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            // {
            //     return Unauthorized();
            // }

            var result = await _dailyFortuneService.GetOrCreateDailyFortuneAsync(UserId);
            return Ok(result);
        }
    }
}