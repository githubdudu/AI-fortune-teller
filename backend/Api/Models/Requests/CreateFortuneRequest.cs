namespace Api.Models.Requests
{
    public class CreateFortuneRequest
    {
        public string Question { get; set; } = string.Empty;
        public Guid? ThemeId { get; set; }
        public Guid[] CardIds { get; set; } = [];

        //Need user info
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(Question) || ThemeId.HasValue;
        }
    }
}
