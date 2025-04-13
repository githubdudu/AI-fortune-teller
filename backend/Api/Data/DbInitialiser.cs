using Microsoft.EntityFrameworkCore;
using Api.Models.Domain;

namespace Api.Data
{
    public static class DbInitializer
    {
        public static void InitialiseData(AppDbContext context)
        {
            if (!context.Themes.Any())
            {
                context.Themes.AddRange(
                    new Theme { Name = "general", ImageSource = "icons/general.png", Description = "Ask about your overall life direction or what’s coming next." },
                    new Theme { Name = "love", ImageSource = "icons/love.png", Description = "Understand your love life, romantic interests, and emotional connections." },
                    new Theme { Name = "finance", ImageSource = "icons/finance.png", Description = "Gain insight into your financial future and money matters." },
                    new Theme { Name = "career", ImageSource = "icons/career.png", Description = "Uncover guidance on job prospects, promotions, or studies." },
                    new Theme { Name = "relationships", ImageSource = "icons/relationships.png", Description = "Understand connections with friends, family, or coworkers." },
                    new Theme { Name = "health", ImageSource = "icons/health.png", Description = "Reflect on your physical and emotional well-being." },
                    new Theme { Name = "decisions", ImageSource = "icons/decisions.png", Description = "Seek clarity when facing difficult choices or uncertain paths." },
                    new Theme { Name = "travel", ImageSource = "icons/travel.png", Description = "Explore outcomes related to moving, traveling, or new environments." }
                );
            }

            if (!context.Cards.Any())
            {
                context.Cards.AddRange(
                new Card
                {
                    Name = "The Fool",
                    Number = "0",
                    ImageSource = "cards/the_fool.png",
                    Description = "The Fool symbolizes key aspects of the human journey. Upright: Positive traits related to the fool. Reversed: Challenges or negative aspects of the fool.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Magician",
                    Number = "1",
                    ImageSource = "cards/the_magician.png",
                    Description = "The Magician symbolizes key aspects of the human journey. Upright: Positive traits related to the magician. Reversed: Challenges or negative aspects of the magician.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The High Priestess",
                    Number = "2",
                    ImageSource = "cards/the_high_priestess.png",
                    Description = "The High Priestess symbolizes key aspects of the human journey. Upright: Positive traits related to the high priestess. Reversed: Challenges or negative aspects of the high priestess.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Empress",
                    Number = "3",
                    ImageSource = "cards/the_empress.png",
                    Description = "The Empress symbolizes key aspects of the human journey. Upright: Positive traits related to the empress. Reversed: Challenges or negative aspects of the empress.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Emperor",
                    Number = "4",
                    ImageSource = "cards/the_emperor.png",
                    Description = "The Emperor symbolizes key aspects of the human journey. Upright: Positive traits related to the emperor. Reversed: Challenges or negative aspects of the emperor.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Hierophant",
                    Number = "5",
                    ImageSource = "cards/the_hierophant.png",
                    Description = "The Hierophant symbolizes key aspects of the human journey. Upright: Positive traits related to the hierophant. Reversed: Challenges or negative aspects of the hierophant.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Lovers",
                    Number = "6",
                    ImageSource = "cards/the_lovers.png",
                    Description = "The Lovers symbolizes key aspects of the human journey. Upright: Positive traits related to the lovers. Reversed: Challenges or negative aspects of the lovers.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Chariot",
                    Number = "7",
                    ImageSource = "cards/the_chariot.png",
                    Description = "The Chariot symbolizes key aspects of the human journey. Upright: Positive traits related to the chariot. Reversed: Challenges or negative aspects of the chariot.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "Strength",
                    Number = "8",
                    ImageSource = "cards/strength.png",
                    Description = "Strength symbolizes key aspects of the human journey. Upright: Positive traits related to strength. Reversed: Challenges or negative aspects of strength.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Hermit",
                    Number = "9",
                    ImageSource = "cards/the_hermit.png",
                    Description = "The Hermit symbolizes key aspects of the human journey. Upright: Positive traits related to the hermit. Reversed: Challenges or negative aspects of the hermit.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "Wheel of Fortune",
                    Number = "10",
                    ImageSource = "cards/wheel_of_fortune.png",
                    Description = "Wheel of Fortune symbolizes key aspects of the human journey. Upright: Positive traits related to wheel of fortune. Reversed: Challenges or negative aspects of wheel of fortune.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "Justice",
                    Number = "11",
                    ImageSource = "cards/justice.png",
                    Description = "Justice symbolizes key aspects of the human journey. Upright: Positive traits related to justice. Reversed: Challenges or negative aspects of justice.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Hanged Man",
                    Number = "12",
                    ImageSource = "cards/the_hanged_man.png",
                    Description = "The Hanged Man symbolizes key aspects of the human journey. Upright: Positive traits related to the hanged man. Reversed: Challenges or negative aspects of the hanged man.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "Death",
                    Number = "13",
                    ImageSource = "cards/death.png",
                    Description = "Death symbolizes key aspects of the human journey. Upright: Positive traits related to death. Reversed: Challenges or negative aspects of death.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "Temperance",
                    Number = "14",
                    ImageSource = "cards/temperance.png",
                    Description = "Temperance symbolizes key aspects of the human journey. Upright: Positive traits related to temperance. Reversed: Challenges or negative aspects of temperance.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Devil",
                    Number = "15",
                    ImageSource = "cards/the_devil.png",
                    Description = "The Devil symbolizes key aspects of the human journey. Upright: Positive traits related to the devil. Reversed: Challenges or negative aspects of the devil.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Tower",
                    Number = "16",
                    ImageSource = "cards/the_tower.png",
                    Description = "The Tower symbolizes key aspects of the human journey. Upright: Positive traits related to the tower. Reversed: Challenges or negative aspects of the tower.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Star",
                    Number = "17",
                    ImageSource = "cards/the_star.png",
                    Description = "The Star symbolizes key aspects of the human journey. Upright: Positive traits related to the star. Reversed: Challenges or negative aspects of the star.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Moon",
                    Number = "18",
                    ImageSource = "cards/the_moon.png",
                    Description = "The Moon symbolizes key aspects of the human journey. Upright: Positive traits related to the moon. Reversed: Challenges or negative aspects of the moon.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The Sun",
                    Number = "19",
                    ImageSource = "cards/the_sun.png",
                    Description = "The Sun symbolizes key aspects of the human journey. Upright: Positive traits related to the sun. Reversed: Challenges or negative aspects of the sun.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "Judgement",
                    Number = "20",
                    ImageSource = "cards/judgement.png",
                    Description = "Judgement symbolizes key aspects of the human journey. Upright: Positive traits related to judgement. Reversed: Challenges or negative aspects of judgement.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "The World",
                    Number = "21",
                    ImageSource = "cards/the_world.png",
                    Description = "The World symbolizes key aspects of the human journey. Upright: Positive traits related to the world. Reversed: Challenges or negative aspects of the world.",
                    IsMajorArcana = true
                },
                new Card
                {
                    Name = "1 of Cups",
                    Number = "1",
                    ImageSource = "cards/1_of_cups.png",
                    Description = "1 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of cups. Reversed: Challenges or negative aspects of 1 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "2 of Cups",
                    Number = "2",
                    ImageSource = "cards/2_of_cups.png",
                    Description = "2 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of cups. Reversed: Challenges or negative aspects of 2 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "3 of Cups",
                    Number = "3",
                    ImageSource = "cards/3_of_cups.png",
                    Description = "3 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of cups. Reversed: Challenges or negative aspects of 3 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "4 of Cups",
                    Number = "4",
                    ImageSource = "cards/4_of_cups.png",
                    Description = "4 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of cups. Reversed: Challenges or negative aspects of 4 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "5 of Cups",
                    Number = "5",
                    ImageSource = "cards/5_of_cups.png",
                    Description = "5 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of cups. Reversed: Challenges or negative aspects of 5 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "6 of Cups",
                    Number = "6",
                    ImageSource = "cards/6_of_cups.png",
                    Description = "6 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of cups. Reversed: Challenges or negative aspects of 6 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "7 of Cups",
                    Number = "7",
                    ImageSource = "cards/7_of_cups.png",
                    Description = "7 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of cups. Reversed: Challenges or negative aspects of 7 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "8 of Cups",
                    Number = "8",
                    ImageSource = "cards/8_of_cups.png",
                    Description = "8 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of cups. Reversed: Challenges or negative aspects of 8 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "9 of Cups",
                    Number = "9",
                    ImageSource = "cards/9_of_cups.png",
                    Description = "9 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of cups. Reversed: Challenges or negative aspects of 9 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "10 of Cups",
                    Number = "10",
                    ImageSource = "cards/10_of_cups.png",
                    Description = "10 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of cups. Reversed: Challenges or negative aspects of 10 of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "Page of Cups",
                    Number = "Page",
                    ImageSource = "cards/page_of_cups.png",
                    Description = "Page of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to page of cups. Reversed: Challenges or negative aspects of page of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "Knight of Cups",
                    Number = "Knight",
                    ImageSource = "cards/knight_of_cups.png",
                    Description = "Knight of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to knight of cups. Reversed: Challenges or negative aspects of knight of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "Queen of Cups",
                    Number = "Queen",
                    ImageSource = "cards/queen_of_cups.png",
                    Description = "Queen of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to queen of cups. Reversed: Challenges or negative aspects of queen of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "King of Cups",
                    Number = "King",
                    ImageSource = "cards/king_of_cups.png",
                    Description = "King of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to king of cups. Reversed: Challenges or negative aspects of king of cups.",
                    IsMajorArcana = false,
                    Suit = "Cups"
                },
                new Card
                {
                    Name = "1 of Pentacles",
                    Number = "1",
                    ImageSource = "cards/1_of_pentacles.png",
                    Description = "1 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of pentacles. Reversed: Challenges or negative aspects of 1 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "2 of Pentacles",
                    Number = "2",
                    ImageSource = "cards/2_of_pentacles.png",
                    Description = "2 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of pentacles. Reversed: Challenges or negative aspects of 2 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "3 of Pentacles",
                    Number = "3",
                    ImageSource = "cards/3_of_pentacles.png",
                    Description = "3 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of pentacles. Reversed: Challenges or negative aspects of 3 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "4 of Pentacles",
                    Number = "4",
                    ImageSource = "cards/4_of_pentacles.png",
                    Description = "4 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of pentacles. Reversed: Challenges or negative aspects of 4 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "5 of Pentacles",
                    Number = "5",
                    ImageSource = "cards/5_of_pentacles.png",
                    Description = "5 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of pentacles. Reversed: Challenges or negative aspects of 5 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "6 of Pentacles",
                    Number = "6",
                    ImageSource = "cards/6_of_pentacles.png",
                    Description = "6 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of pentacles. Reversed: Challenges or negative aspects of 6 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "7 of Pentacles",
                    Number = "7",
                    ImageSource = "cards/7_of_pentacles.png",
                    Description = "7 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of pentacles. Reversed: Challenges or negative aspects of 7 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "8 of Pentacles",
                    Number = "8",
                    ImageSource = "cards/8_of_pentacles.png",
                    Description = "8 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of pentacles. Reversed: Challenges or negative aspects of 8 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "9 of Pentacles",
                    Number = "9",
                    ImageSource = "cards/9_of_pentacles.png",
                    Description = "9 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of pentacles. Reversed: Challenges or negative aspects of 9 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "10 of Pentacles",
                    Number = "10",
                    ImageSource = "cards/10_of_pentacles.png",
                    Description = "10 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of pentacles. Reversed: Challenges or negative aspects of 10 of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "Page of Pentacles",
                    Number = "Page",
                    ImageSource = "cards/page_of_pentacles.png",
                    Description = "Page of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to page of pentacles. Reversed: Challenges or negative aspects of page of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "Knight of Pentacles",
                    Number = "Knight",
                    ImageSource = "cards/knight_of_pentacles.png",
                    Description = "Knight of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to knight of pentacles. Reversed: Challenges or negative aspects of knight of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "Queen of Pentacles",
                    Number = "Queen",
                    ImageSource = "cards/queen_of_pentacles.png",
                    Description = "Queen of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to queen of pentacles. Reversed: Challenges or negative aspects of queen of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "King of Pentacles",
                    Number = "King",
                    ImageSource = "cards/king_of_pentacles.png",
                    Description = "King of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to king of pentacles. Reversed: Challenges or negative aspects of king of pentacles.",
                    IsMajorArcana = false,
                    Suit = "Pentacles"
                },
                new Card
                {
                    Name = "1 of Swords",
                    Number = "1",
                    ImageSource = "cards/1_of_swords.png",
                    Description = "1 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of swords. Reversed: Challenges or negative aspects of 1 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "2 of Swords",
                    Number = "2",
                    ImageSource = "cards/2_of_swords.png",
                    Description = "2 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of swords. Reversed: Challenges or negative aspects of 2 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "3 of Swords",
                    Number = "3",
                    ImageSource = "cards/3_of_swords.png",
                    Description = "3 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of swords. Reversed: Challenges or negative aspects of 3 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "4 of Swords",
                    Number = "4",
                    ImageSource = "cards/4_of_swords.png",
                    Description = "4 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of swords. Reversed: Challenges or negative aspects of 4 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "5 of Swords",
                    Number = "5",
                    ImageSource = "cards/5_of_swords.png",
                    Description = "5 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of swords. Reversed: Challenges or negative aspects of 5 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "6 of Swords",
                    Number = "6",
                    ImageSource = "cards/6_of_swords.png",
                    Description = "6 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of swords. Reversed: Challenges or negative aspects of 6 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "7 of Swords",
                    Number = "7",
                    ImageSource = "cards/7_of_swords.png",
                    Description = "7 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of swords. Reversed: Challenges or negative aspects of 7 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "8 of Swords",
                    Number = "8",
                    ImageSource = "cards/8_of_swords.png",
                    Description = "8 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of swords. Reversed: Challenges or negative aspects of 8 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "9 of Swords",
                    Number = "9",
                    ImageSource = "cards/9_of_swords.png",
                    Description = "9 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of swords. Reversed: Challenges or negative aspects of 9 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "10 of Swords",
                    Number = "10",
                    ImageSource = "cards/10_of_swords.png",
                    Description = "10 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of swords. Reversed: Challenges or negative aspects of 10 of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "Page of Swords",
                    Number = "Page",
                    ImageSource = "cards/page_of_swords.png",
                    Description = "Page of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to page of swords. Reversed: Challenges or negative aspects of page of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "Knight of Swords",
                    Number = "Knight",
                    ImageSource = "cards/knight_of_swords.png",
                    Description = "Knight of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to knight of swords. Reversed: Challenges or negative aspects of knight of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "Queen of Swords",
                    Number = "Queen",
                    ImageSource = "cards/queen_of_swords.png",
                    Description = "Queen of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to queen of swords. Reversed: Challenges or negative aspects of queen of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "King of Swords",
                    Number = "King",
                    ImageSource = "cards/king_of_swords.png",
                    Description = "King of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to king of swords. Reversed: Challenges or negative aspects of king of swords.",
                    IsMajorArcana = false,
                    Suit = "Swords"
                },
                new Card
                {
                    Name = "1 of Wands",
                    Number = "1",
                    ImageSource = "cards/1_of_wands.png",
                    Description = "1 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of wands. Reversed: Challenges or negative aspects of 1 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "2 of Wands",
                    Number = "2",
                    ImageSource = "cards/2_of_wands.png",
                    Description = "2 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of wands. Reversed: Challenges or negative aspects of 2 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "3 of Wands",
                    Number = "3",
                    ImageSource = "cards/3_of_wands.png",
                    Description = "3 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of wands. Reversed: Challenges or negative aspects of 3 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "4 of Wands",
                    Number = "4",
                    ImageSource = "cards/4_of_wands.png",
                    Description = "4 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of wands. Reversed: Challenges or negative aspects of 4 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "5 of Wands",
                    Number = "5",
                    ImageSource = "cards/5_of_wands.png",
                    Description = "5 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of wands. Reversed: Challenges or negative aspects of 5 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "6 of Wands",
                    Number = "6",
                    ImageSource = "cards/6_of_wands.png",
                    Description = "6 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of wands. Reversed: Challenges or negative aspects of 6 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "7 of Wands",
                    Number = "7",
                    ImageSource = "cards/7_of_wands.png",
                    Description = "7 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of wands. Reversed: Challenges or negative aspects of 7 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "8 of Wands",
                    Number = "8",
                    ImageSource = "cards/8_of_wands.png",
                    Description = "8 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of wands. Reversed: Challenges or negative aspects of 8 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "9 of Wands",
                    Number = "9",
                    ImageSource = "cards/9_of_wands.png",
                    Description = "9 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of wands. Reversed: Challenges or negative aspects of 9 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "10 of Wands",
                    Number = "10",
                    ImageSource = "cards/10_of_wands.png",
                    Description = "10 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of wands. Reversed: Challenges or negative aspects of 10 of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "Page of Wands",
                    Number = "Page",
                    ImageSource = "cards/page_of_wands.png",
                    Description = "Page of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to page of wands. Reversed: Challenges or negative aspects of page of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "Knight of Wands",
                    Number = "Knight",
                    ImageSource = "cards/knight_of_wands.png",
                    Description = "Knight of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to knight of wands. Reversed: Challenges or negative aspects of knight of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "Queen of Wands",
                    Number = "Queen",
                    ImageSource = "cards/queen_of_wands.png",
                    Description = "Queen of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to queen of wands. Reversed: Challenges or negative aspects of queen of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                },
                new Card
                {
                    Name = "King of Wands",
                    Number = "King",
                    ImageSource = "cards/king_of_wands.png",
                    Description = "King of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to king of wands. Reversed: Challenges or negative aspects of king of wands.",
                    IsMajorArcana = false,
                    Suit = "Wands"
                }
            );
            }

            context.SaveChanges();
        }
    }
}