namespace Api.Models.Requests
{
    public class CreateFortuneRequest
    {
        public string Question { get; set; } = string.Empty;
        public Guid? ThemeId { get; set; }
        public required Guid[] CardIds { get; set; } = [];
        public string UserEmail { get; set; } = string.Empty;

        // A reading needs a theme, a question, or both — plus 1-3 cards.
        public bool IsValid() =>
            (ThemeId.HasValue || !string.IsNullOrWhiteSpace(Question))
            && CardIds is { Length: >= 1 and <= 3 };
    }
}
