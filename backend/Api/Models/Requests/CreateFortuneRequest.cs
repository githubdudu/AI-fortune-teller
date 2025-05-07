namespace Api.Models.Requests
{
    public class CreateFortuneRequest
    {
        public string Question { get; set; } = string.Empty;
        public Guid? ThemeId { get; set; }
        public required Guid[] CardIds { get; set; } = [];

        //Need user info
        public bool IsValid()
        {
            bool hasValidInput = !string.IsNullOrWhiteSpace(Question) || ThemeId.HasValue;
            //Change selected cards validation accordingly.
            bool hasValidCards = CardIds != null && CardIds.Length >= 1 && CardIds.Length <= 3;

            return hasValidInput && hasValidCards;
        }
    }
}
