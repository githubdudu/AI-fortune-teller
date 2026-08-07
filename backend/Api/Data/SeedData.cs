using Api.Models.Domain;

namespace Api.Data
{
    /// <summary>
    /// The rows <see cref="DbInitializer"/> inserts on first run: the eight reading
    /// themes and the full 78 card Rider-Waite deck.
    ///
    /// Every method builds fresh entities on each call. Returning shared static
    /// instances would let one DbContext's change tracker hold on to objects a
    /// later one also tries to add.
    ///
    /// ImageSource paths point at the frontend's own static assets under
    /// public/cards/ and public/themes/, so the names here have to stay in step
    /// with the files on disk.
    /// </summary>
    public static class SeedData
    {
        public static IEnumerable<Theme> CreateThemes() =>
            [
                new Theme
                {
                    Name = "general",
                    ImageSource = "/themes/general.webp",
                    Description = "Ask about your overall life direction or what’s coming next.",
                },
                new Theme
                {
                    Name = "love",
                    ImageSource = "/themes/love.webp",
                    Description =
                        "Understand your love life, romantic interests, and emotional connections.",
                },
                new Theme
                {
                    Name = "finance",
                    ImageSource = "/themes/finance.webp",
                    Description = "Gain insight into your financial future and money matters.",
                },
                new Theme
                {
                    Name = "career",
                    ImageSource = "/themes/career.webp",
                    Description = "Uncover guidance on job prospects, promotions, or studies.",
                },
                new Theme
                {
                    Name = "relationships",
                    ImageSource = "/themes/relationships.webp",
                    Description = "Understand connections with friends, family, or coworkers.",
                },
                new Theme
                {
                    Name = "health",
                    ImageSource = "/themes/health.webp",
                    Description = "Reflect on your physical and emotional well-being.",
                },
                new Theme
                {
                    Name = "decisions",
                    ImageSource = "/themes/decisions.webp",
                    Description = "Seek clarity when facing difficult choices or uncertain paths.",
                },
                new Theme
                {
                    Name = "travel",
                    ImageSource = "/themes/travel.webp",
                    Description =
                        "Explore outcomes related to moving, traveling, or new environments.",
                },
            ];

        public static IEnumerable<Card> CreateMajorArcana() =>
            [
                new Card
                {
                    Name = "The Fool",
                    Number = 0,
                    ImageSource = "/cards/major/00-the-fool.png",
                    Description =
                        "The Fool symbolizes key aspects of the human journey. Upright: Positive traits related to the fool. Reversed: Challenges or negative aspects of the fool.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Magician",
                    Number = 1,
                    ImageSource = "/cards/major/01-the-magician.png",
                    Description =
                        "The Magician symbolizes key aspects of the human journey. Upright: Positive traits related to the magician. Reversed: Challenges or negative aspects of the magician.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The High Priestess",
                    Number = 2,
                    ImageSource = "/cards/major/02-the-high-priestess.png",
                    Description =
                        "The High Priestess symbolizes key aspects of the human journey. Upright: Positive traits related to the high priestess. Reversed: Challenges or negative aspects of the high priestess.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Empress",
                    Number = 3,
                    ImageSource = "/cards/major/03-the-empress.png",
                    Description =
                        "The Empress symbolizes key aspects of the human journey. Upright: Positive traits related to the empress. Reversed: Challenges or negative aspects of the empress.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Emperor",
                    Number = 4,
                    ImageSource = "/cards/major/04-the-emperor.png",
                    Description =
                        "The Emperor symbolizes key aspects of the human journey. Upright: Positive traits related to the emperor. Reversed: Challenges or negative aspects of the emperor.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Hierophant",
                    Number = 5,
                    ImageSource = "/cards/major/05-the-hierophant.png",
                    Description =
                        "The Hierophant symbolizes key aspects of the human journey. Upright: Positive traits related to the hierophant. Reversed: Challenges or negative aspects of the hierophant.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Lovers",
                    Number = 6,
                    ImageSource = "/cards/major/06-the-lovers.png",
                    Description =
                        "The Lovers symbolizes key aspects of the human journey. Upright: Positive traits related to the lovers. Reversed: Challenges or negative aspects of the lovers.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Chariot",
                    Number = 7,
                    ImageSource = "/cards/major/07-the-chariot.png",
                    Description =
                        "The Chariot symbolizes key aspects of the human journey. Upright: Positive traits related to the chariot. Reversed: Challenges or negative aspects of the chariot.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Strength",
                    Number = 8,
                    ImageSource = "/cards/major/08-strength.png",
                    Description =
                        "Strength symbolizes key aspects of the human journey. Upright: Positive traits related to strength. Reversed: Challenges or negative aspects of strength.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Hermit",
                    Number = 9,
                    ImageSource = "/cards/major/09-the-hermit.png",
                    Description =
                        "The Hermit symbolizes key aspects of the human journey. Upright: Positive traits related to the hermit. Reversed: Challenges or negative aspects of the hermit.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Wheel of Fortune",
                    Number = 10,
                    ImageSource = "/cards/major/10-wheel-of-fortune.png",
                    Description =
                        "Wheel of Fortune symbolizes key aspects of the human journey. Upright: Positive traits related to wheel of fortune. Reversed: Challenges or negative aspects of wheel of fortune.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Justice",
                    Number = 11,
                    ImageSource = "/cards/major/11-justice.png",
                    Description =
                        "Justice symbolizes key aspects of the human journey. Upright: Positive traits related to justice. Reversed: Challenges or negative aspects of justice.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Hanged Man",
                    Number = 12,
                    ImageSource = "/cards/major/12-the-hanged-man.png",
                    Description =
                        "The Hanged Man symbolizes key aspects of the human journey. Upright: Positive traits related to the hanged man. Reversed: Challenges or negative aspects of the hanged man.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Death",
                    Number = 13,
                    ImageSource = "/cards/major/13-death.png",
                    Description =
                        "Death symbolizes key aspects of the human journey. Upright: Positive traits related to death. Reversed: Challenges or negative aspects of death.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Temperance",
                    Number = 14,
                    ImageSource = "/cards/major/14-temperance.png",
                    Description =
                        "Temperance symbolizes key aspects of the human journey. Upright: Positive traits related to temperance. Reversed: Challenges or negative aspects of temperance.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Devil",
                    Number = 15,
                    ImageSource = "/cards/major/15-the-devil.png",
                    Description =
                        "The Devil symbolizes key aspects of the human journey. Upright: Positive traits related to the devil. Reversed: Challenges or negative aspects of the devil.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Tower",
                    Number = 16,
                    ImageSource = "/cards/major/16-the-tower.png",
                    Description =
                        "The Tower symbolizes key aspects of the human journey. Upright: Positive traits related to the tower. Reversed: Challenges or negative aspects of the tower.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Star",
                    Number = 17,
                    ImageSource = "/cards/major/17-the-star.png",
                    Description =
                        "The Star symbolizes key aspects of the human journey. Upright: Positive traits related to the star. Reversed: Challenges or negative aspects of the star.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Moon",
                    Number = 18,
                    ImageSource = "/cards/major/18-the-moon.png",
                    Description =
                        "The Moon symbolizes key aspects of the human journey. Upright: Positive traits related to the moon. Reversed: Challenges or negative aspects of the moon.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Sun",
                    Number = 19,
                    ImageSource = "/cards/major/19-the-sun.png",
                    Description =
                        "The Sun symbolizes key aspects of the human journey. Upright: Positive traits related to the sun. Reversed: Challenges or negative aspects of the sun.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Judgement",
                    Number = 20,
                    ImageSource = "/cards/major/20-judgement.png",
                    Description =
                        "Judgement symbolizes key aspects of the human journey. Upright: Positive traits related to judgement. Reversed: Challenges or negative aspects of judgement.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The World",
                    Number = 21,
                    ImageSource = "/cards/major/21-the-world.png",
                    Description =
                        "The World symbolizes key aspects of the human journey. Upright: Positive traits related to the world. Reversed: Challenges or negative aspects of the world.",
                    IsMajorArcana = true,
                },
            ];

        public static IEnumerable<Card> CreateCups() =>
            [
                new Card
                {
                    Name = "Ace of Cups",
                    Number = 1,
                    ImageSource = "/cards/cups/01-ace-of-cups.png",
                    Description =
                        "Ace of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to ace of cups. Reversed: Challenges or negative aspects of ace of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "2 of Cups",
                    Number = 2,
                    ImageSource = "/cards/cups/02-two-of-cups.png",
                    Description =
                        "2 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of cups. Reversed: Challenges or negative aspects of 2 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "3 of Cups",
                    Number = 3,
                    ImageSource = "/cards/cups/03-three-of-cups.png",
                    Description =
                        "3 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of cups. Reversed: Challenges or negative aspects of 3 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "4 of Cups",
                    Number = 4,
                    ImageSource = "/cards/cups/04-four-of-cups.png",
                    Description =
                        "4 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of cups. Reversed: Challenges or negative aspects of 4 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "5 of Cups",
                    Number = 5,
                    ImageSource = "/cards/cups/05-five-of-cups.png",
                    Description =
                        "5 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of cups. Reversed: Challenges or negative aspects of 5 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "6 of Cups",
                    Number = 6,
                    ImageSource = "/cards/cups/06-six-of-cups.png",
                    Description =
                        "6 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of cups. Reversed: Challenges or negative aspects of 6 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "7 of Cups",
                    Number = 7,
                    ImageSource = "/cards/cups/07-seven-of-cups.png",
                    Description =
                        "7 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of cups. Reversed: Challenges or negative aspects of 7 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "8 of Cups",
                    Number = 8,
                    ImageSource = "/cards/cups/08-eight-of-cups.png",
                    Description =
                        "8 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of cups. Reversed: Challenges or negative aspects of 8 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "9 of Cups",
                    Number = 9,
                    ImageSource = "/cards/cups/09-nine-of-cups.png",
                    Description =
                        "9 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of cups. Reversed: Challenges or negative aspects of 9 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "10 of Cups",
                    Number = 10,
                    ImageSource = "/cards/cups/10-ten-of-cups.png",
                    Description =
                        "10 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of cups. Reversed: Challenges or negative aspects of 10 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "Page of Cups",
                    Number = 11,
                    ImageSource = "/cards/cups/11-page-of-cups.png",
                    Description =
                        "Page of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to page of cups. Reversed: Challenges or negative aspects of page of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "Knight of Cups",
                    Number = 12,
                    ImageSource = "/cards/cups/12-knight-of-cups.png",
                    Description =
                        "Knight of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to knight of cups. Reversed: Challenges or negative aspects of knight of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "Queen of Cups",
                    Number = 13,
                    ImageSource = "/cards/cups/13-queen-of-cups.png",
                    Description =
                        "Queen of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to queen of cups. Reversed: Challenges or negative aspects of queen of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "King of Cups",
                    Number = 14,
                    ImageSource = "/cards/cups/14-king-of-cups.png",
                    Description =
                        "King of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to king of cups. Reversed: Challenges or negative aspects of king of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
            ];

        public static IEnumerable<Card> CreatePentacles() =>
            [
                new Card
                {
                    Name = "Ace of Pentacles",
                    Number = 1,
                    ImageSource = "/cards/pentacles/01-ace-of-pentacles.png",
                    Description =
                        "Ace of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to ace of pentacles. Reversed: Challenges or negative aspects of ace of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "2 of Pentacles",
                    Number = 2,
                    ImageSource = "/cards/pentacles/02-two-of-pentacles.png",
                    Description =
                        "2 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of pentacles. Reversed: Challenges or negative aspects of 2 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "3 of Pentacles",
                    Number = 3,
                    ImageSource = "/cards/pentacles/03-three-of-pentacles.png",
                    Description =
                        "3 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of pentacles. Reversed: Challenges or negative aspects of 3 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "4 of Pentacles",
                    Number = 4,
                    ImageSource = "/cards/pentacles/04-four-of-pentacles.png",
                    Description =
                        "4 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of pentacles. Reversed: Challenges or negative aspects of 4 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "5 of Pentacles",
                    Number = 5,
                    ImageSource = "/cards/pentacles/05-five-of-pentacles.png",
                    Description =
                        "5 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of pentacles. Reversed: Challenges or negative aspects of 5 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "6 of Pentacles",
                    Number = 6,
                    ImageSource = "/cards/pentacles/06-six-of-pentacles.png",
                    Description =
                        "6 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of pentacles. Reversed: Challenges or negative aspects of 6 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "7 of Pentacles",
                    Number = 7,
                    ImageSource = "/cards/pentacles/07-seven-of-pentacles.png",
                    Description =
                        "7 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of pentacles. Reversed: Challenges or negative aspects of 7 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "8 of Pentacles",
                    Number = 8,
                    ImageSource = "/cards/pentacles/08-eight-of-pentacles.png",
                    Description =
                        "8 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of pentacles. Reversed: Challenges or negative aspects of 8 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "9 of Pentacles",
                    Number = 9,
                    ImageSource = "/cards/pentacles/09-nine-of-pentacles.png",
                    Description =
                        "9 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of pentacles. Reversed: Challenges or negative aspects of 9 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "10 of Pentacles",
                    Number = 10,
                    ImageSource = "/cards/pentacles/10-ten-of-pentacles.png",
                    Description =
                        "10 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of pentacles. Reversed: Challenges or negative aspects of 10 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "Page of Pentacles",
                    Number = 11,
                    ImageSource = "/cards/pentacles/11-page-of-pentacles.png",
                    Description =
                        "Page of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to page of pentacles. Reversed: Challenges or negative aspects of page of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "Knight of Pentacles",
                    Number = 12,
                    ImageSource = "/cards/pentacles/12-knight-of-pentacles.png",
                    Description =
                        "Knight of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to knight of pentacles. Reversed: Challenges or negative aspects of knight of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "Queen of Pentacles",
                    Number = 13,
                    ImageSource = "/cards/pentacles/13-queen-of-pentacles.png",
                    Description =
                        "Queen of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to queen of pentacles. Reversed: Challenges or negative aspects of queen of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "King of Pentacles",
                    Number = 14,
                    ImageSource = "/cards/pentacles/14-king-of-pentacles.png",
                    Description =
                        "King of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to king of pentacles. Reversed: Challenges or negative aspects of king of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
            ];

        public static IEnumerable<Card> CreateSwords() =>
            [
                new Card
                {
                    Name = "Ace of Swords",
                    Number = 1,
                    ImageSource = "/cards/swords/01-ace-of-swords.png",
                    Description =
                        "Ace of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to ace of swords. Reversed: Challenges or negative aspects of ace of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "2 of Swords",
                    Number = 2,
                    ImageSource = "/cards/swords/02-two-of-swords.png",
                    Description =
                        "2 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of swords. Reversed: Challenges or negative aspects of 2 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "3 of Swords",
                    Number = 3,
                    ImageSource = "/cards/swords/03-three-of-swords.png",
                    Description =
                        "3 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of swords. Reversed: Challenges or negative aspects of 3 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "4 of Swords",
                    Number = 4,
                    ImageSource = "/cards/swords/04-four-of-swords.png",
                    Description =
                        "4 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of swords. Reversed: Challenges or negative aspects of 4 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "5 of Swords",
                    Number = 5,
                    ImageSource = "/cards/swords/05-five-of-swords.png",
                    Description =
                        "5 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of swords. Reversed: Challenges or negative aspects of 5 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "6 of Swords",
                    Number = 6,
                    ImageSource = "/cards/swords/06-six-of-swords.png",
                    Description =
                        "6 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of swords. Reversed: Challenges or negative aspects of 6 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "7 of Swords",
                    Number = 7,
                    ImageSource = "/cards/swords/07-seven-of-swords.png",
                    Description =
                        "7 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of swords. Reversed: Challenges or negative aspects of 7 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "8 of Swords",
                    Number = 8,
                    ImageSource = "/cards/swords/08-eight-of-swords.png",
                    Description =
                        "8 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of swords. Reversed: Challenges or negative aspects of 8 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "9 of Swords",
                    Number = 9,
                    ImageSource = "/cards/swords/09-nine-of-swords.png",
                    Description =
                        "9 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of swords. Reversed: Challenges or negative aspects of 9 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "10 of Swords",
                    Number = 10,
                    ImageSource = "/cards/swords/10-ten-of-swords.png",
                    Description =
                        "10 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of swords. Reversed: Challenges or negative aspects of 10 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "Page of Swords",
                    Number = 11,
                    ImageSource = "/cards/swords/11-page-of-swords.png",
                    Description =
                        "Page of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to page of swords. Reversed: Challenges or negative aspects of page of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "Knight of Swords",
                    Number = 12,
                    ImageSource = "/cards/swords/12-knight-of-swords.png",
                    Description =
                        "Knight of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to knight of swords. Reversed: Challenges or negative aspects of knight of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "Queen of Swords",
                    Number = 13,
                    ImageSource = "/cards/swords/13-queen-of-swords.png",
                    Description =
                        "Queen of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to queen of swords. Reversed: Challenges or negative aspects of queen of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "King of Swords",
                    Number = 14,
                    ImageSource = "/cards/swords/14-king-of-swords.png",
                    Description =
                        "King of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to king of swords. Reversed: Challenges or negative aspects of king of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
            ];

        public static IEnumerable<Card> CreateWands() =>
            [
                new Card
                {
                    Name = "Ace of Wands",
                    Number = 1,
                    ImageSource = "/cards/wands/01-ace-of-wands.png",
                    Description =
                        "Ace of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to ace of wands. Reversed: Challenges or negative aspects of ace of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "2 of Wands",
                    Number = 2,
                    ImageSource = "/cards/wands/02-two-of-wands.png",
                    Description =
                        "2 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of wands. Reversed: Challenges or negative aspects of 2 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "3 of Wands",
                    Number = 3,
                    ImageSource = "/cards/wands/03-three-of-wands.png",
                    Description =
                        "3 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of wands. Reversed: Challenges or negative aspects of 3 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "4 of Wands",
                    Number = 4,
                    ImageSource = "/cards/wands/04-four-of-wands.png",
                    Description =
                        "4 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of wands. Reversed: Challenges or negative aspects of 4 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "5 of Wands",
                    Number = 5,
                    ImageSource = "/cards/wands/05-five-of-wands.png",
                    Description =
                        "5 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of wands. Reversed: Challenges or negative aspects of 5 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "6 of Wands",
                    Number = 6,
                    ImageSource = "/cards/wands/06-six-of-wands.png",
                    Description =
                        "6 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of wands. Reversed: Challenges or negative aspects of 6 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "7 of Wands",
                    Number = 7,
                    ImageSource = "/cards/wands/07-seven-of-wands.png",
                    Description =
                        "7 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of wands. Reversed: Challenges or negative aspects of 7 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "8 of Wands",
                    Number = 8,
                    ImageSource = "/cards/wands/08-eight-of-wands.png",
                    Description =
                        "8 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of wands. Reversed: Challenges or negative aspects of 8 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "9 of Wands",
                    Number = 9,
                    ImageSource = "/cards/wands/09-nine-of-wands.png",
                    Description =
                        "9 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of wands. Reversed: Challenges or negative aspects of 9 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "10 of Wands",
                    Number = 10,
                    ImageSource = "/cards/wands/10-ten-of-wands.png",
                    Description =
                        "10 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of wands. Reversed: Challenges or negative aspects of 10 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "Page of Wands",
                    Number = 11,
                    ImageSource = "/cards/wands/11-page-of-wands.png",
                    Description =
                        "Page of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to page of wands. Reversed: Challenges or negative aspects of page of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "Knight of Wands",
                    Number = 12,
                    ImageSource = "/cards/wands/12-knight-of-wands.png",
                    Description =
                        "Knight of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to knight of wands. Reversed: Challenges or negative aspects of knight of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "Queen of Wands",
                    Number = 13,
                    ImageSource = "/cards/wands/13-queen-of-wands.png",
                    Description =
                        "Queen of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to queen of wands. Reversed: Challenges or negative aspects of queen of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "King of Wands",
                    Number = 14,
                    ImageSource = "/cards/wands/14-king-of-wands.png",
                    Description =
                        "King of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to king of wands. Reversed: Challenges or negative aspects of king of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
            ];
    }
}
