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
                        "The Fool tarot card means new beginnings, innocence, spontaneity, and a leap of faith. Upright, it points to a fresh start, adventure, and trusting where life leads; reversed, it warns of recklessness, naivety, or holding back out of fear.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Magician",
                    Number = 1,
                    ImageSource = "/cards/major/01-the-magician.png",
                    Description =
                        "The Magician tarot card means manifestation, willpower, resourcefulness, and action. Upright, you have the skills and focus to create what you want; reversed, it signals untapped potential, manipulation, or poor planning.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The High Priestess",
                    Number = 2,
                    ImageSource = "/cards/major/02-the-high-priestess.png",
                    Description =
                        "The High Priestess tarot card means intuition, mystery, the subconscious, and inner wisdom. Upright, it asks you to trust your intuition and listen to hidden knowledge; reversed, it points to ignored intuition, secrets, or disconnection from yourself.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Empress",
                    Number = 3,
                    ImageSource = "/cards/major/03-the-empress.png",
                    Description =
                        "The Empress tarot card means abundance, nurturing, fertility, and creativity. Upright, it signals growth, sensual pleasure, comfort, and care; reversed, it points to creative blocks, neglected self-care, dependence, or smothering energy.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Emperor",
                    Number = 4,
                    ImageSource = "/cards/major/04-the-emperor.png",
                    Description =
                        "The Emperor tarot card means authority, structure, stability, and leadership. Upright, it signals control, discipline, and solid foundations; reversed, it warns of domination, rigidity, or a lack of discipline.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Hierophant",
                    Number = 5,
                    ImageSource = "/cards/major/05-the-hierophant.png",
                    Description =
                        "The Hierophant tarot card means tradition, spiritual wisdom, and shared beliefs. Upright, it points to guidance, learning, and conventional paths; reversed, it signals rebellion, unconventional choices, or challenging the status quo.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Lovers",
                    Number = 6,
                    ImageSource = "/cards/major/06-the-lovers.png",
                    Description =
                        "The Lovers tarot card means love, harmony, choices, and alignment of values. Upright, it signals deep connection, union, and an important decision; reversed, it points to disharmony, imbalance, or misaligned values.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Chariot",
                    Number = 7,
                    ImageSource = "/cards/major/07-the-chariot.png",
                    Description =
                        "The Chariot tarot card means willpower, determination, victory, and control. Upright, focus and drive carry you past obstacles to success; reversed, it warns of lost direction, scattered energy, or loss of control.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Strength",
                    Number = 8,
                    ImageSource = "/cards/major/08-strength.png",
                    Description =
                        "The Strength tarot card means inner strength, courage, patience, and compassion. Upright, it signals calm control and taming fear with gentleness; reversed, it points to self-doubt, low confidence, or raw, unchecked emotion.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Hermit",
                    Number = 9,
                    ImageSource = "/cards/major/09-the-hermit.png",
                    Description =
                        "The Hermit tarot card means introspection, solitude, soul-searching, and inner guidance. Upright, it invites you to withdraw and seek your own answers; reversed, it warns of isolation and loneliness, or signals a return to the world.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Wheel of Fortune",
                    Number = 10,
                    ImageSource = "/cards/major/10-wheel-of-fortune.png",
                    Description =
                        "The Wheel of Fortune tarot card means cycles, fate, luck, and turning points. Upright, it signals a change of fortune and destiny in motion; reversed, it points to bad luck, resistance to change, or a downturn.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Justice",
                    Number = 11,
                    ImageSource = "/cards/major/11-justice.png",
                    Description =
                        "The Justice tarot card means fairness, truth, cause and effect, and accountability. Upright, it signals a fair outcome and taking responsibility for your actions; reversed, it warns of injustice, dishonesty, or avoiding accountability.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Hanged Man",
                    Number = 12,
                    ImageSource = "/cards/major/12-the-hanged-man.png",
                    Description =
                        "The Hanged Man tarot card means surrender, pause, and a new perspective. Upright, it asks you to let go, wait, and gain insight through stillness or sacrifice; reversed, it points to stalling, indecision, resistance, or needless self-sacrifice.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Death",
                    Number = 13,
                    ImageSource = "/cards/major/13-death.png",
                    Description =
                        "The Death tarot card means transformation, endings, and rebirth, almost never literal death. Upright, it marks the close of one chapter so a new one can begin; reversed, it signals resistance to change, stagnation, or a fear of letting go.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Temperance",
                    Number = 14,
                    ImageSource = "/cards/major/14-temperance.png",
                    Description =
                        "The Temperance tarot card means balance, moderation, patience, and harmony. Upright, it signals blending opposites and walking the calm middle path; reversed, it points to excess, impatience, or imbalance.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Devil",
                    Number = 15,
                    ImageSource = "/cards/major/15-the-devil.png",
                    Description =
                        "The Devil tarot card means bondage, addiction, materialism, and the shadow self. Upright, it signals feeling trapped by desire or unhealthy attachments; reversed, it means breaking free, releasing limiting beliefs, and reclaiming power.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Tower",
                    Number = 16,
                    ImageSource = "/cards/major/16-the-tower.png",
                    Description =
                        "The Tower tarot card means sudden upheaval, revelation, and the collapse of false foundations. Upright, it signals an abrupt, often shocking change that ultimately frees you; reversed, it points to a delayed crisis or fear of inevitable change.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Star",
                    Number = 17,
                    ImageSource = "/cards/major/17-the-star.png",
                    Description =
                        "The Star tarot card means hope, faith, renewal, and healing. Upright, it signals optimism, inspiration, and calm after hardship; reversed, it points to despair, lost faith, or discouragement.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Moon",
                    Number = 18,
                    ImageSource = "/cards/major/18-the-moon.png",
                    Description =
                        "The Moon tarot card means illusion, intuition, and the subconscious. Upright, it signals uncertainty, hidden truths, anxiety, or vivid dreams urging you to trust your instincts; reversed, it means confusion clearing, fears releasing, or secrets coming to light.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The Sun",
                    Number = 19,
                    ImageSource = "/cards/major/19-the-sun.png",
                    Description =
                        "The Sun tarot card means joy, success, positivity, and vitality. Upright, it signals happiness, warmth, achievement, and clarity; reversed, it points to temporary gloom, blocked joy, or overconfidence.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "Judgement",
                    Number = 20,
                    ImageSource = "/cards/major/20-judgement.png",
                    Description =
                        "The Judgement tarot card means reckoning, rebirth, awakening, and self-evaluation. Upright, it signals a wake-up call and a chance to begin again; reversed, it points to self-doubt or refusing to learn from the past.",
                    IsMajorArcana = true,
                },
                new Card
                {
                    Name = "The World",
                    Number = 21,
                    ImageSource = "/cards/major/21-the-world.png",
                    Description =
                        "The World tarot card means completion, fulfillment, achievement, and wholeness. Upright, it signals the successful end of a cycle and accomplishment; reversed, it points to incompletion, loose ends, or lack of closure.",
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
                        "The Ace of Cups tarot card means new love, emotional beginnings, and compassion. Upright, it signals a new relationship or emotional awakening; reversed, it points to blocked emotions, emptiness, or repressed feelings.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "2 of Cups",
                    Number = 2,
                    ImageSource = "/cards/cups/02-two-of-cups.png",
                    Description =
                        "The Two of Cups (also written 2 of Cups) tarot card means partnership, mutual attraction, and connection. Upright, it signals a balanced, loving bond between two people; reversed, it points to disharmony, a breakup, or imbalance in a relationship.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "3 of Cups",
                    Number = 3,
                    ImageSource = "/cards/cups/03-three-of-cups.png",
                    Description =
                        "The Three of Cups (also written 3 of Cups) tarot card means friendship, celebration, and community. Upright, it signals joyful gatherings, support, and happy reunions; reversed, it warns of overindulgence, gossip, or a fading social circle.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "4 of Cups",
                    Number = 4,
                    ImageSource = "/cards/cups/04-four-of-cups.png",
                    Description =
                        "The Four of Cups (also written 4 of Cups) tarot card means apathy, contemplation, and missed opportunity. Upright, it signals boredom, withdrawal, or taking things for granted; reversed, it means new awareness, re-engaging, or accepting an offer.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "5 of Cups",
                    Number = 5,
                    ImageSource = "/cards/cups/05-five-of-cups.png",
                    Description =
                        "The Five of Cups (also written 5 of Cups) tarot card means loss, grief, regret, and disappointment. Upright, it signals focusing on what has been lost; reversed, it means acceptance, forgiveness, and moving on.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "6 of Cups",
                    Number = 6,
                    ImageSource = "/cards/cups/06-six-of-cups.png",
                    Description =
                        "The Six of Cups (also written 6 of Cups) tarot card means nostalgia, innocence, and happy memories. Upright, it signals reunions, kindness, and revisiting the past fondly; reversed, it warns of being stuck in the past or living unrealistically.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "7 of Cups",
                    Number = 7,
                    ImageSource = "/cards/cups/07-seven-of-cups.png",
                    Description =
                        "The Seven of Cups (also written 7 of Cups) tarot card means choices, illusion, fantasy, and wishful thinking. Upright, it signals many tempting options but confusion among them; reversed, it means clarity, focus, and seeing through illusion.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "8 of Cups",
                    Number = 8,
                    ImageSource = "/cards/cups/08-eight-of-cups.png",
                    Description =
                        "The Eight of Cups (also written 8 of Cups) tarot card means walking away, withdrawal, and seeking deeper meaning. Upright, it signals leaving something behind in search of fulfillment; reversed, it points to fear of moving on, drifting, or aimlessness.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "9 of Cups",
                    Number = 9,
                    ImageSource = "/cards/cups/09-nine-of-cups.png",
                    Description =
                        "The Nine of Cups (also written 9 of Cups) tarot card means contentment, satisfaction, and wishes fulfilled. Upright, it is the \"wish card\", emotional and material happiness; reversed, it points to dissatisfaction, greed, or unfulfilled wishes.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "10 of Cups",
                    Number = 10,
                    ImageSource = "/cards/cups/10-ten-of-cups.png",
                    Description =
                        "The Ten of Cups (also written 10 of Cups) tarot card means harmony, family, and lasting emotional fulfillment. Upright, it signals a happy home and enduring joy; reversed, it points to a broken family, disconnection, or conflict at home.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "Page of Cups",
                    Number = 11,
                    ImageSource = "/cards/cups/11-page-of-cups.png",
                    Description =
                        "The Page of Cups tarot card means creative beginnings, intuition, and emotional messages. Upright, it signals new feelings, a surprise message, and curiosity; reversed, it points to emotional immaturity, moodiness, or blocked creativity.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "Knight of Cups",
                    Number = 12,
                    ImageSource = "/cards/cups/12-knight-of-cups.png",
                    Description =
                        "The Knight of Cups tarot card means romance, charm, idealism, and following the heart. Upright, it signals a romantic offer or proposal led by feeling; reversed, it points to moodiness, unrealistic ideals, or disappointment.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "Queen of Cups",
                    Number = 13,
                    ImageSource = "/cards/cups/13-queen-of-cups.png",
                    Description =
                        "The Queen of Cups tarot card means compassion, emotional security, and nurturing intuition. Upright, it signals a caring, empathetic person in tune with feelings; reversed, it points to emotional insecurity, over-sensitivity, or codependency.",
                    IsMajorArcana = false,
                    Suit = "Cups",
                },
                new Card
                {
                    Name = "King of Cups",
                    Number = 14,
                    ImageSource = "/cards/cups/14-king-of-cups.png",
                    Description =
                        "The King of Cups tarot card means emotional balance, compassion, and diplomacy. Upright, it signals calm mastery of emotions and wise counsel; reversed, it points to emotional manipulation, moodiness, or repression.",
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
                        "The Ace of Pentacles tarot card means new opportunity, prosperity, and abundance. Upright, it signals a new job, money, or a fresh material start; reversed, it points to a lost opportunity, financial delay, or scarcity.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "2 of Pentacles",
                    Number = 2,
                    ImageSource = "/cards/pentacles/02-two-of-pentacles.png",
                    Description =
                        "The Two of Pentacles (also written 2 of Pentacles) tarot card means balance, adaptability, and juggling priorities. Upright, it signals managing multiple demands with flexibility; reversed, it points to overwhelm, disorganization, or dropping the ball.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "3 of Pentacles",
                    Number = 3,
                    ImageSource = "/cards/pentacles/03-three-of-pentacles.png",
                    Description =
                        "The Three of Pentacles (also written 3 of Pentacles) tarot card means teamwork, collaboration, and craftsmanship. Upright, it signals working together and recognition of your skill; reversed, it points to poor teamwork, low quality, or disharmony.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "4 of Pentacles",
                    Number = 4,
                    ImageSource = "/cards/pentacles/04-four-of-pentacles.png",
                    Description =
                        "The Four of Pentacles (also written 4 of Pentacles) tarot card means security, control, and saving. Upright, it signals stability, though it can warn of possessiveness; reversed, it means letting go and generosity, or financial insecurity.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "5 of Pentacles",
                    Number = 5,
                    ImageSource = "/cards/pentacles/05-five-of-pentacles.png",
                    Description =
                        "The Five of Pentacles (also written 5 of Pentacles) tarot card means hardship, loss, and insecurity. Upright, it signals financial trouble, isolation, or feeling left out; reversed, it means recovery, help arriving, and the end of hardship.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "6 of Pentacles",
                    Number = 6,
                    ImageSource = "/cards/pentacles/06-six-of-pentacles.png",
                    Description =
                        "The Six of Pentacles (also written 6 of Pentacles) tarot card means generosity, charity, and giving and receiving. Upright, it signals a balanced exchange of support and sharing; reversed, it points to strings attached, inequality, or debt.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "7 of Pentacles",
                    Number = 7,
                    ImageSource = "/cards/pentacles/07-seven-of-pentacles.png",
                    Description =
                        "The Seven of Pentacles (also written 7 of Pentacles) tarot card means patience, investment, and long-term growth. Upright, it signals waiting for your effort to pay off; reversed, it points to impatience, poor returns, or wasted effort.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "8 of Pentacles",
                    Number = 8,
                    ImageSource = "/cards/pentacles/08-eight-of-pentacles.png",
                    Description =
                        "The Eight of Pentacles (also written 8 of Pentacles) tarot card means diligence, skill-building, and dedication. Upright, it signals hard work, focus, and mastery of a craft; reversed, it points to lack of focus, perfectionism, or uninspired work.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "9 of Pentacles",
                    Number = 9,
                    ImageSource = "/cards/pentacles/09-nine-of-pentacles.png",
                    Description =
                        "The Nine of Pentacles (also written 9 of Pentacles) tarot card means abundance, independence, and self-sufficiency. Upright, it signals security and comfort earned on your own; reversed, it points to over-dependence, setbacks, or hollow success.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "10 of Pentacles",
                    Number = 10,
                    ImageSource = "/cards/pentacles/10-ten-of-pentacles.png",
                    Description =
                        "The Ten of Pentacles (also written 10 of Pentacles) tarot card means wealth, legacy, family, and lasting security. Upright, it signals long-term prosperity, inheritance, and stability; reversed, it points to instability, family disputes, or fleeting wealth.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "Page of Pentacles",
                    Number = 11,
                    ImageSource = "/cards/pentacles/11-page-of-pentacles.png",
                    Description =
                        "The Page of Pentacles tarot card means ambition, study, and new opportunity. Upright, it signals a new venture, learning, and goal-setting; reversed, it points to procrastination, lack of progress, or missed chances.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "Knight of Pentacles",
                    Number = 12,
                    ImageSource = "/cards/pentacles/12-knight-of-pentacles.png",
                    Description =
                        "The Knight of Pentacles tarot card means hard work, reliability, and routine. Upright, it signals steady, dependable, methodical progress; reversed, it points to boredom, stagnation, or over-caution.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "Queen of Pentacles",
                    Number = 13,
                    ImageSource = "/cards/pentacles/13-queen-of-pentacles.png",
                    Description =
                        "The Queen of Pentacles tarot card means nurturing, practicality, and grounded abundance. Upright, it signals a caring, resourceful provider; reversed, it points to self-neglect, work-life imbalance, or smothering.",
                    IsMajorArcana = false,
                    Suit = "Pentacles",
                },
                new Card
                {
                    Name = "King of Pentacles",
                    Number = 14,
                    ImageSource = "/cards/pentacles/14-king-of-pentacles.png",
                    Description =
                        "The King of Pentacles tarot card means wealth, discipline, and material success. Upright, it signals financial mastery, stability, and generosity; reversed, it warns of greed, materialism, or poor management.",
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
                        "The Ace of Swords tarot card means clarity, truth, breakthrough, and mental focus. Upright, it signals a new idea, clear thinking, and a victory of intellect; reversed, it points to confusion, miscommunication, or clouded judgement.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "2 of Swords",
                    Number = 2,
                    ImageSource = "/cards/swords/02-two-of-swords.png",
                    Description =
                        "The Two of Swords (also written 2 of Swords) tarot card means indecision, stalemate, and difficult choices. Upright, it signals weighing options while feeling blocked; reversed, it means indecision lifting, or information finally revealed.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "3 of Swords",
                    Number = 3,
                    ImageSource = "/cards/swords/03-three-of-swords.png",
                    Description =
                        "The Three of Swords (also written 3 of Swords) tarot card means heartbreak, sorrow, and painful truth. Upright, it signals emotional pain, betrayal, or loss; reversed, it means healing, recovery, and releasing pain.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "4 of Swords",
                    Number = 4,
                    ImageSource = "/cards/swords/04-four-of-swords.png",
                    Description =
                        "The Four of Swords (also written 4 of Swords) tarot card means rest, recovery, and contemplation. Upright, it signals a needed pause for healing and stillness; reversed, it points to restlessness, burnout, or slowly re-engaging.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "5 of Swords",
                    Number = 5,
                    ImageSource = "/cards/swords/05-five-of-swords.png",
                    Description =
                        "The Five of Swords (also written 5 of Swords) tarot card means conflict, defeat, and winning at a cost. Upright, it signals hollow victory, hostility, or discord; reversed, it means reconciliation, making amends, and moving on.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "6 of Swords",
                    Number = 6,
                    ImageSource = "/cards/swords/06-six-of-swords.png",
                    Description =
                        "The Six of Swords (also written 6 of Swords) tarot card means transition, moving on, and leaving difficulty behind. Upright, it signals a journey toward calmer waters; reversed, it points to resistance to change or feeling stuck.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "7 of Swords",
                    Number = 7,
                    ImageSource = "/cards/swords/07-seven-of-swords.png",
                    Description =
                        "The Seven of Swords (also written 7 of Swords) tarot card means deception, strategy, stealth, and cunning. Upright, it signals trickery, acting alone, or getting away with something; reversed, it means coming clean, exposure, or a guilty conscience.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "8 of Swords",
                    Number = 8,
                    ImageSource = "/cards/swords/08-eight-of-swords.png",
                    Description =
                        "The Eight of Swords (also written 8 of Swords) tarot card means restriction, feeling trapped, and self-imposed limits. Upright, it signals powerlessness, fear, and a victim mindset; reversed, it means freeing yourself and finding a new perspective.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "9 of Swords",
                    Number = 9,
                    ImageSource = "/cards/swords/09-nine-of-swords.png",
                    Description =
                        "The Nine of Swords (also written 9 of Swords) tarot card means anxiety, worry, fear, and nightmares. Upright, it signals mental anguish, dread, and sleepless nights; reversed, it means hope returning, facing fears, and relief.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "10 of Swords",
                    Number = 10,
                    ImageSource = "/cards/swords/10-ten-of-swords.png",
                    Description =
                        "The Ten of Swords (also written 10 of Swords) tarot card means painful endings, betrayal, and rock bottom. Upright, it signals a definitive ending or collapse; reversed, it means recovery, the worst is over and renewal begins.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "Page of Swords",
                    Number = 11,
                    ImageSource = "/cards/swords/11-page-of-swords.png",
                    Description =
                        "The Page of Swords tarot card means curiosity, new ideas, and vigilance. Upright, it signals mental energy, truth-seeking, and fresh thinking; reversed, it points to gossip, scattered ideas, or haste.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "Knight of Swords",
                    Number = 12,
                    ImageSource = "/cards/swords/12-knight-of-swords.png",
                    Description =
                        "The Knight of Swords tarot card means ambition, drive, and fast, direct action. Upright, it signals charging ahead with focus and force; reversed, it warns of recklessness, impatience, or aggression.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "Queen of Swords",
                    Number = 13,
                    ImageSource = "/cards/swords/13-queen-of-swords.png",
                    Description =
                        "The Queen of Swords tarot card means clarity, independence, honesty, and perception. Upright, it signals a clear-headed, fair, and direct person; reversed, it points to coldness, harshness, or bitterness.",
                    IsMajorArcana = false,
                    Suit = "Swords",
                },
                new Card
                {
                    Name = "King of Swords",
                    Number = 14,
                    ImageSource = "/cards/swords/14-king-of-swords.png",
                    Description =
                        "The King of Swords tarot card means authority, intellect, truth, and mental clarity. Upright, it signals clear judgement, fairness, and logic; reversed, it warns of manipulation, tyranny, or harsh, cold logic.",
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
                        "The Ace of Wands tarot card means inspiration, new ventures, and creative spark. Upright, it signals a new project, passion, and raw potential; reversed, it points to delays, lack of motivation, or false starts.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "2 of Wands",
                    Number = 2,
                    ImageSource = "/cards/wands/02-two-of-wands.png",
                    Description =
                        "The Two of Wands (also written 2 of Wands) tarot card means planning, future vision, and decisions. Upright, it signals looking ahead and mapping out your goals; reversed, it points to fear of the unknown, poor planning, or playing it safe.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "3 of Wands",
                    Number = 3,
                    ImageSource = "/cards/wands/03-three-of-wands.png",
                    Description =
                        "The Three of Wands (also written 3 of Wands) tarot card means expansion, foresight, and progress. Upright, it signals plans in motion and looking outward for growth; reversed, it points to delays, obstacles, or lack of foresight.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "4 of Wands",
                    Number = 4,
                    ImageSource = "/cards/wands/04-four-of-wands.png",
                    Description =
                        "The Four of Wands (also written 4 of Wands) tarot card means celebration, harmony, home, and milestones. Upright, it signals a joyful event, stability, and community; reversed, it points to instability, lack of support, or transition at home.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "5 of Wands",
                    Number = 5,
                    ImageSource = "/cards/wands/05-five-of-wands.png",
                    Description =
                        "The Five of Wands (also written 5 of Wands) tarot card means conflict, competition, and tension. Upright, it signals rivalry, clashes, or healthy competition; reversed, it means avoiding conflict, resolution, or inner tension.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "6 of Wands",
                    Number = 6,
                    ImageSource = "/cards/wands/06-six-of-wands.png",
                    Description =
                        "The Six of Wands (also written 6 of Wands) tarot card means victory, recognition, and public success. Upright, it signals triumph and well-earned acclaim; reversed, it points to lack of recognition, ego, or a fall from grace.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "7 of Wands",
                    Number = 7,
                    ImageSource = "/cards/wands/07-seven-of-wands.png",
                    Description =
                        "The Seven of Wands (also written 7 of Wands) tarot card means defense, perseverance, and standing your ground. Upright, it signals defending your position against challenge; reversed, it points to feeling overwhelmed, yielding, or giving up.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "8 of Wands",
                    Number = 8,
                    ImageSource = "/cards/wands/08-eight-of-wands.png",
                    Description =
                        "The Eight of Wands (also written 8 of Wands) tarot card means speed, movement, swift action, and news. Upright, it signals fast progress, messages, and things moving quickly; reversed, it points to delays, frustration, or things slowing down.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "9 of Wands",
                    Number = 9,
                    ImageSource = "/cards/wands/09-nine-of-wands.png",
                    Description =
                        "The Nine of Wands (also written 9 of Wands) tarot card means resilience, persistence, and boundaries. Upright, it signals being weary but determined, almost at the finish; reversed, it points to exhaustion, defensiveness, or giving up.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "10 of Wands",
                    Number = 10,
                    ImageSource = "/cards/wands/10-ten-of-wands.png",
                    Description =
                        "The Ten of Wands (also written 10 of Wands) tarot card means burden, responsibility, and overload. Upright, it signals carrying too much and nearing burnout; reversed, it means releasing burdens and delegating, or collapse.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "Page of Wands",
                    Number = 11,
                    ImageSource = "/cards/wands/11-page-of-wands.png",
                    Description =
                        "The Page of Wands tarot card means enthusiasm, exploration, and new ideas. Upright, it signals excitement, discovery, and a spark of inspiration; reversed, it points to aimlessness, hesitation, or lack of direction.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "Knight of Wands",
                    Number = 12,
                    ImageSource = "/cards/wands/12-knight-of-wands.png",
                    Description =
                        "The Knight of Wands tarot card means energy, passion, adventure, and boldness. Upright, it signals bold action and charging after a goal; reversed, it warns of recklessness, haste, or frustrating delays.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "Queen of Wands",
                    Number = 13,
                    ImageSource = "/cards/wands/13-queen-of-wands.png",
                    Description =
                        "The Queen of Wands tarot card means confidence, warmth, courage, and charisma. Upright, it signals a vibrant, determined, magnetic presence; reversed, it points to self-doubt, jealousy, or insecurity.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
                new Card
                {
                    Name = "King of Wands",
                    Number = 14,
                    ImageSource = "/cards/wands/14-king-of-wands.png",
                    Description =
                        "The King of Wands tarot card means leadership, vision, and bold charisma. Upright, it signals a natural leader acting on a big vision; reversed, it warns of impulsiveness, arrogance, or being overbearing.",
                    IsMajorArcana = false,
                    Suit = "Wands",
                },
            ];
    }
}
