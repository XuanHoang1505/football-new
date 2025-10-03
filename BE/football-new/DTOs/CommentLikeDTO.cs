namespace footballnew.DTOs
{
    public class CommentLikeDTO
    {
        public int CommentId { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}