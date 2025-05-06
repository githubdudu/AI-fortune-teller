using Api.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public static class DbInitializer
    {
        public static void InitializeData(ApplicationDbContext context)
        {
            if (!context.Themes.Any())
            {
                context.Themes.AddRange(
                    new Theme
                    {
                        Name = "general",
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Theme/5.%20General.jpg",
                        Description =
                            "Ask about your overall life direction or what’s coming next.",
                    },
                    new Theme
                    {
                        Name = "love",
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Theme/5.%20Love.jpg",
                        Description =
                            "Understand your love life, romantic interests, and emotional connections.",
                    },
                    new Theme
                    {
                        Name = "finance",
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Theme/5.%20Finance.jpg",
                        Description = "Gain insight into your financial future and money matters.",
                    },
                    new Theme
                    {
                        Name = "career",
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Theme/5.%20Career.jpg",
                        Description = "Uncover guidance on job prospects, promotions, or studies.",
                    },
                    new Theme
                    {
                        Name = "relationships",
                        ImageSource = "icons/relationships.png",
                        Description = "Understand connections with friends, family, or coworkers.",
                    },
                    new Theme
                    {
                        Name = "health",
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Theme/5.%20Health.jpg",
                        Description = "Reflect on your physical and emotional well-being.",
                    },
                    new Theme
                    {
                        Name = "decisions",
                        ImageSource = "icons/decisions.png",
                        Description =
                            "Seek clarity when facing difficult choices or uncertain paths.",
                    },
                    new Theme
                    {
                        Name = "travel",
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Theme/5.%20Travel.jpg",
                        Description =
                            "Explore outcomes related to moving, traveling, or new environments.",
                    }
                );
            }

            if (!context.Cards.Any())
            {
                context.Cards.AddRange(
                    new Card
                    {
                        Name = "The Fool",
                        Number = 0,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Fool%20(I).png",
                        Description =
                            "The Fool symbolizes key aspects of the human journey. Upright: Positive traits related to the fool. Reversed: Challenges or negative aspects of the fool.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Magician",
                        Number = 1,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Magician%20(I).png",
                        Description =
                            "The Magician symbolizes key aspects of the human journey. Upright: Positive traits related to the magician. Reversed: Challenges or negative aspects of the magician.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The High Priestess",
                        Number = 2,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20High%20Priestess%20(II).png",
                        Description =
                            "The High Priestess symbolizes key aspects of the human journey. Upright: Positive traits related to the high priestess. Reversed: Challenges or negative aspects of the high priestess.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Empress",
                        Number = 3,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Empress%20(III).png",
                        Description =
                            "The Empress symbolizes key aspects of the human journey. Upright: Positive traits related to the empress. Reversed: Challenges or negative aspects of the empress.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Emperor",
                        Number = 4,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Emperor(IV).png",
                        Description =
                            "The Emperor symbolizes key aspects of the human journey. Upright: Positive traits related to the emperor. Reversed: Challenges or negative aspects of the emperor.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Hierophant",
                        Number = 5,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Hierophant%20(V).png",
                        Description =
                            "The Hierophant symbolizes key aspects of the human journey. Upright: Positive traits related to the hierophant. Reversed: Challenges or negative aspects of the hierophant.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Lovers",
                        Number = 6,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Lovers%20(VI).png",
                        Description =
                            "The Lovers symbolizes key aspects of the human journey. Upright: Positive traits related to the lovers. Reversed: Challenges or negative aspects of the lovers.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Chariot",
                        Number = 7,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Chariot%20(VII).png",
                        Description =
                            "The Chariot symbolizes key aspects of the human journey. Upright: Positive traits related to the chariot. Reversed: Challenges or negative aspects of the chariot.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "Strength",
                        Number = 8,
                        ImageSource = "cards/strength.png",
                        Description =
                            "Strength symbolizes key aspects of the human journey. Upright: Positive traits related to strength. Reversed: Challenges or negative aspects of strength.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Hermit",
                        Number = 9,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Hermit%20(IX).png",
                        Description =
                            "The Hermit symbolizes key aspects of the human journey. Upright: Positive traits related to the hermit. Reversed: Challenges or negative aspects of the hermit.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "Wheel of Fortune",
                        Number = 10,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20Wheel%20of%20Fortune%20(X).png",
                        Description =
                            "Wheel of Fortune symbolizes key aspects of the human journey. Upright: Positive traits related to wheel of fortune. Reversed: Challenges or negative aspects of wheel of fortune.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "Justice",
                        Number = 11,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20Justice%20(XI).png",
                        Description =
                            "Justice symbolizes key aspects of the human journey. Upright: Positive traits related to justice. Reversed: Challenges or negative aspects of justice.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Hanged Man",
                        Number = 12,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Hanged%20Man(XII).png",
                        Description =
                            "The Hanged Man symbolizes key aspects of the human journey. Upright: Positive traits related to the hanged man. Reversed: Challenges or negative aspects of the hanged man.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "Death",
                        Number = 13,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20Death(XIII).png",
                        Description =
                            "Death symbolizes key aspects of the human journey. Upright: Positive traits related to death. Reversed: Challenges or negative aspects of death.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "Temperance",
                        Number = 14,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20Temperance%20(XIV).png",
                        Description =
                            "Temperance symbolizes key aspects of the human journey. Upright: Positive traits related to temperance. Reversed: Challenges or negative aspects of temperance.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Devil",
                        Number = 15,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Devil(XV).png",
                        Description =
                            "The Devil symbolizes key aspects of the human journey. Upright: Positive traits related to the devil. Reversed: Challenges or negative aspects of the devil.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Tower",
                        Number = 16,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Tower%20(XVI).png",
                        Description =
                            "The Tower symbolizes key aspects of the human journey. Upright: Positive traits related to the tower. Reversed: Challenges or negative aspects of the tower.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Star",
                        Number = 17,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Star%20(XVII)%20.png",
                        Description =
                            "The Star symbolizes key aspects of the human journey. Upright: Positive traits related to the star. Reversed: Challenges or negative aspects of the star.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Moon",
                        Number = 18,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20moon%20(XVIII),%20.png",
                        Description =
                            "The Moon symbolizes key aspects of the human journey. Upright: Positive traits related to the moon. Reversed: Challenges or negative aspects of the moon.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The Sun",
                        Number = 19,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Sun(XIX).PNG",
                        Description =
                            "The Sun symbolizes key aspects of the human journey. Upright: Positive traits related to the sun. Reversed: Challenges or negative aspects of the sun.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "Judgement",
                        Number = 20,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20Judgement(XX).png",
                        Description =
                            "Judgement symbolizes key aspects of the human journey. Upright: Positive traits related to judgement. Reversed: Challenges or negative aspects of judgement.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "The World",
                        Number = 21,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20World%20(XXI).png",
                        Description =
                            "The World symbolizes key aspects of the human journey. Upright: Positive traits related to the world. Reversed: Challenges or negative aspects of the world.",
                        IsMajorArcana = true,
                    },
                    new Card
                    {
                        Name = "1 of Cups",
                        Number = 1,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Ace%20of%20Cups%20(Ace).png",
                        Description =
                            "1 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of cups. Reversed: Challenges or negative aspects of 1 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "2 of Cups",
                        Number = 2,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Two%20of%20Cups(II).png",
                        Description =
                            "2 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of cups. Reversed: Challenges or negative aspects of 2 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "3 of Cups",
                        Number = 3,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Three%20of%20cups%20(III).png",
                        Description =
                            "3 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of cups. Reversed: Challenges or negative aspects of 3 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "4 of Cups",
                        Number = 4,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Four%20of%20Cups%20(IV).png",
                        Description =
                            "4 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of cups. Reversed: Challenges or negative aspects of 4 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "5 of Cups",
                        Number = 5,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Five%20of%20cups%20(V).png",
                        Description =
                            "5 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of cups. Reversed: Challenges or negative aspects of 5 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "6 of Cups",
                        Number = 6,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Six%20of%20cups%20(VI).png",
                        Description =
                            "6 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of cups. Reversed: Challenges or negative aspects of 6 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "7 of Cups",
                        Number = 7,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Seven%20of%20cups%20(VII).png",
                        Description =
                            "7 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of cups. Reversed: Challenges or negative aspects of 7 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "8 of Cups",
                        Number = 8,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Eight%20of%20cups%20(IIII).png",
                        Description =
                            "8 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of cups. Reversed: Challenges or negative aspects of 8 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "9 of Cups",
                        Number = 9,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Nine%20of%20cups%20(IX).png",
                        Description =
                            "9 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of cups. Reversed: Challenges or negative aspects of 9 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "10 of Cups",
                        Number = 10,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Ten%20of%20cups%20(X).png",
                        Description =
                            "10 of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of cups. Reversed: Challenges or negative aspects of 10 of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "Page of Cups",
                        Number = 11,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Page%20of%20Cups%20(XI).png",
                        Description =
                            "Page of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to page of cups. Reversed: Challenges or negative aspects of page of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "Knight of Cups",
                        Number = 12,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Knight%20of%20Cups%20(XII).png",
                        Description =
                            "Knight of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to knight of cups. Reversed: Challenges or negative aspects of knight of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "Queen of Cups",
                        Number = 13,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20Queen%20of%20Cups(XIII).png",
                        Description =
                            "Queen of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to queen of cups. Reversed: Challenges or negative aspects of queen of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "King of Cups",
                        Number = 14,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Cups/3.%20King%20of%20Cups（XIV）.png",
                        Description =
                            "King of Cups symbolizes key aspects of the human journey. Upright: Positive traits related to king of cups. Reversed: Challenges or negative aspects of king of cups.",
                        IsMajorArcana = false,
                        Suit = "Cups",
                    },
                    new Card
                    {
                        Name = "1 of Pentacles",
                        Number = 1,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Ace%20of%20Pentacles%20(I).png",
                        Description =
                            "1 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of pentacles. Reversed: Challenges or negative aspects of 1 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "2 of Pentacles",
                        Number = 2,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Two%20of%20Pentacles%20(II).png",
                        Description =
                            "2 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of pentacles. Reversed: Challenges or negative aspects of 2 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "3 of Pentacles",
                        Number = 3,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Three%20of%20Pentacles%20(III).png",
                        Description =
                            "3 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of pentacles. Reversed: Challenges or negative aspects of 3 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "4 of Pentacles",
                        Number = 4,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Four%20of%20Pentacles%20(IV).png",
                        Description =
                            "4 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of pentacles. Reversed: Challenges or negative aspects of 4 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "5 of Pentacles",
                        Number = 5,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Five%20of%20Pentacles%20(V).png",
                        Description =
                            "5 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of pentacles. Reversed: Challenges or negative aspects of 5 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "6 of Pentacles",
                        Number = 6,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Six%20of%20Pentacles(VI).png",
                        Description =
                            "6 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of pentacles. Reversed: Challenges or negative aspects of 6 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "7 of Pentacles",
                        Number = 7,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Seven%20of%20Pentacles（VII）.png",
                        Description =
                            "7 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of pentacles. Reversed: Challenges or negative aspects of 7 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "8 of Pentacles",
                        Number = 8,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Eight%20of%20Pentacles%20(VIII).png",
                        Description =
                            "8 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of pentacles. Reversed: Challenges or negative aspects of 8 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "9 of Pentacles",
                        Number = 9,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Nine%20of%20Pentacles%20(IX).png",
                        Description =
                            "9 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of pentacles. Reversed: Challenges or negative aspects of 9 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "10 of Pentacles",
                        Number = 10,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Ten%20of%20Pentacles%20(X).png",
                        Description =
                            "10 of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of pentacles. Reversed: Challenges or negative aspects of 10 of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "Page of Pentacles",
                        Number = 11,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Page%20of%20Pentacles%20(XI).png",
                        Description =
                            "Page of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to page of pentacles. Reversed: Challenges or negative aspects of page of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "Knight of Pentacles",
                        Number = 12,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Knight%20of%20Pentacles(XII).png",
                        Description =
                            "Knight of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to knight of pentacles. Reversed: Challenges or negative aspects of knight of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "Queen of Pentacles",
                        Number = 13,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20Queen%20of%20Pentacles%20(XIII).png",
                        Description =
                            "Queen of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to queen of pentacles. Reversed: Challenges or negative aspects of queen of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "King of Pentacles",
                        Number = 14,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Pentacles/2.%20King%20of%20Pentacles%20(XIV).png",
                        Description =
                            "King of Pentacles symbolizes key aspects of the human journey. Upright: Positive traits related to king of pentacles. Reversed: Challenges or negative aspects of king of pentacles.",
                        IsMajorArcana = false,
                        Suit = "Pentacles",
                    },
                    new Card
                    {
                        Name = "1 of Swords",
                        Number = 1,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Ace+of+swords(Ace).png",
                        Description =
                            "1 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of swords. Reversed: Challenges or negative aspects of 1 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "2 of Swords",
                        Number = 2,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Two+of+swords(II).png",
                        Description =
                            "2 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of swords. Reversed: Challenges or negative aspects of 2 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "3 of Swords",
                        Number = 3,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Three+of+swords(III).png",
                        Description =
                            "3 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of swords. Reversed: Challenges or negative aspects of 3 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "4 of Swords",
                        Number = 4,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Four+of+swords(IV).png",
                        Description =
                            "4 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of swords. Reversed: Challenges or negative aspects of 4 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "5 of Swords",
                        Number = 5,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Five+of+sowrds(V).png",
                        Description =
                            "5 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of swords. Reversed: Challenges or negative aspects of 5 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "6 of Swords",
                        Number = 6,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Six+of+swords(VI).png",
                        Description =
                            "6 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of swords. Reversed: Challenges or negative aspects of 6 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "7 of Swords",
                        Number = 7,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Seven+of+swords(VII).png",
                        Description =
                            "7 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of swords. Reversed: Challenges or negative aspects of 7 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "8 of Swords",
                        Number = 8,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Eight+of+swords(VIII).png",
                        Description =
                            "8 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of swords. Reversed: Challenges or negative aspects of 8 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "9 of Swords",
                        Number = 9,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Nine+of+swords(IX).png",
                        Description =
                            "9 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of swords. Reversed: Challenges or negative aspects of 9 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "10 of Swords",
                        Number = 10,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Ten+of+swords(X).png",
                        Description =
                            "10 of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of swords. Reversed: Challenges or negative aspects of 10 of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "Page of Swords",
                        Number = 11,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Page+of+swordsXI).png",
                        Description =
                            "Page of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to page of swords. Reversed: Challenges or negative aspects of page of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "Knight of Swords",
                        Number = 12,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Knight+of+swords(XII).png",
                        Description =
                            "Knight of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to knight of swords. Reversed: Challenges or negative aspects of knight of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "Queen of Swords",
                        Number = 13,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/Queen+of+swords(XIII).png",
                        Description =
                            "Queen of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to queen of swords. Reversed: Challenges or negative aspects of queen of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "King of Swords",
                        Number = 14,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/MInor_Sowrds/King+of+swords(XIV).png",
                        Description =
                            "King of Swords symbolizes key aspects of the human journey. Upright: Positive traits related to king of swords. Reversed: Challenges or negative aspects of king of swords.",
                        IsMajorArcana = false,
                        Suit = "Swords",
                    },
                    new Card
                    {
                        Name = "1 of Wands",
                        Number = 1,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Ace%20of%20Wands(I).png",
                        Description =
                            "1 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 1 of wands. Reversed: Challenges or negative aspects of 1 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "2 of Wands",
                        Number = 2,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Two%20of%20Wands(I).png",
                        Description =
                            "2 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 2 of wands. Reversed: Challenges or negative aspects of 2 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "3 of Wands",
                        Number = 3,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Three%20of%20Wands(III).png",
                        Description =
                            "3 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 3 of wands. Reversed: Challenges or negative aspects of 3 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "4 of Wands",
                        Number = 4,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Four%20of%20Wands(IV).png",
                        Description =
                            "4 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 4 of wands. Reversed: Challenges or negative aspects of 4 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "5 of Wands",
                        Number = 5,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Five%20of%20Wands(V).png",
                        Description =
                            "5 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 5 of wands. Reversed: Challenges or negative aspects of 5 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "6 of Wands",
                        Number = 6,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Six%20of%20Wands(VI).png",
                        Description =
                            "6 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 6 of wands. Reversed: Challenges or negative aspects of 6 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "7 of Wands",
                        Number = 7,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Seven%20of%20Wands(X).png",
                        Description =
                            "7 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 7 of wands. Reversed: Challenges or negative aspects of 7 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "8 of Wands",
                        Number = 8,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Eight%20of%20Wands(XIII).png",
                        Description =
                            "8 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 8 of wands. Reversed: Challenges or negative aspects of 8 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "9 of Wands",
                        Number = 9,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Nine%20of%20Wands(IX).png",
                        Description =
                            "9 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 9 of wands. Reversed: Challenges or negative aspects of 9 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "10 of Wands",
                        Number = 10,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Ten%20of%20Wands%20(X).png",
                        Description =
                            "10 of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to 10 of wands. Reversed: Challenges or negative aspects of 10 of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "Page of Wands",
                        Number = 11,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Page%20of%20Wands(XI).png",
                        Description =
                            "Page of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to page of wands. Reversed: Challenges or negative aspects of page of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "Knight of Wands",
                        Number = 12,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Knight%20of%20Wands(XII).png",
                        Description =
                            "Knight of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to knight of wands. Reversed: Challenges or negative aspects of knight of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "Queen of Wands",
                        Number = 13,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20Queen%20of%20Wands(XIII).png",
                        Description =
                            "Queen of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to queen of wands. Reversed: Challenges or negative aspects of queen of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    },
                    new Card
                    {
                        Name = "King of Wands",
                        Number = 14,
                        ImageSource = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Wands/1.%20King%20of%20Wands(XIV).png",
                        Description =
                            "King of Wands symbolizes key aspects of the human journey. Upright: Positive traits related to king of wands. Reversed: Challenges or negative aspects of king of wands.",
                        IsMajorArcana = false,
                        Suit = "Wands",
                    }
                );
            }

            context.SaveChanges();
        }
    }
}
