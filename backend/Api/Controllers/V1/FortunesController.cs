using Api.Models.DTOs;
using Api.Models.Requests;
using Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class FortunesController : ControllerBase
    {
        private readonly IFortuneService _fortuneService;

        public FortunesController(IFortuneService fortuneService)
        {
            _fortuneService = fortuneService;
        }

        [HttpPost("ask")]
        public async Task<ActionResult<FortuneDto>> AskFortune([FromBody] CreateFortuneRequest request)
        {
            try
            {
                var fortune = await _fortuneService.GenerateFortuneAsync(request);
                return Ok(fortune);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
