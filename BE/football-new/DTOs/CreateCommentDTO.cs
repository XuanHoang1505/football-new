namespace footballnew.DTOs
{
    public class CreateCommentDTO
    {
        public string Content { get; set; } = null!;
        public int ArticleId { get; set; }
        public string UserId { get; set; } = null!;
        public int? ParentId { get; set; }
        
    }
}