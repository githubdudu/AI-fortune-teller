using Api.Models.DTOs;

namespace Api.Services.Interfaces
{
    public interface ICardService
    {
        Task<IEnumerable<CardDto>> GetAllCardsAsync();
        Task<IEnumerable<CardDto>> GetRandomCardsAsync(int? limit = null);
        Task<CardDto?> GetCardByIdAsync(Guid id);
    }
}
