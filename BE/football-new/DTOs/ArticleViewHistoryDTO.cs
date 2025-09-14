namespace footballnew.DTOs
{
    public class ArticleViewHistoryDTO
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public DateTime ViewAt { get; set; }
    }
}