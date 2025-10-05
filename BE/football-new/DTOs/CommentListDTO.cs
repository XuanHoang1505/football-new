namespace footballnew.DTOs
{
    public class CommentListDTO
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string ArticleTitle { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public bool IsHidden { get; set; } = false;
        public int LikeCount { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public int? ParentId { get; set; }

    }
}
