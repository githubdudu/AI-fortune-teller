using System;

namespace Api.Models.Domain
public class Card
{
    public int Id { get; set; }
    public required string Name { get; set; }  // Card name
    public required string Number { get; set; }  // if major arcana: 0~21, else if minor arcana: 1~10, Page, Knight, Queen, King
    public required string ImageSource { get; set; }  // PNG
    public required string Description { get; set; }  // Card description text
    public required bool IsMajorArcana { get; set; }  // Indicates if the card is a major arcana or a minor arcana
    public string? Suit { get; set; }  // if minor arcana: Cups, Wands, Swords, Pentacles
}