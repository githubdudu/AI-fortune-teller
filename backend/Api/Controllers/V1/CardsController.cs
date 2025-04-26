using Api.Models.DTOs;
using Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class CardsController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardsController(ICardService cardService)
        {
            _cardService = cardService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CardDto>>> GetCards()
        {
            var cards = await _cardService.GetAllCardsAsync();
            return Ok(cards);
        }

        [HttpGet("random")]
        public async Task<ActionResult<IEnumerable<CardDto>>> GetRandomCards(
            [FromQuery] int? limit = null
        )
        {
            if (limit.HasValue && limit.Value <= 0)
            {
                return BadRequest("Limit must be greater than zero.");
            }

            var cards = await _cardService.GetRandomCardsAsync(limit);
            return Ok(cards);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardDto>> GetCard(Guid id)
        {
            var card = await _cardService.GetCardByIdAsync(id);
            if (card == null)
            {
                return NotFound();
            }

            return Ok(card);
        }
    }
}
