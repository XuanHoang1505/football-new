using footballnew.Data;

namespace footballnew.Models
{
    public class CommentLike
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        // Liên kết đến Comment
        public int CommentId { get; set; }
        public Comment Comment { get; set; } = null!;

        public bool IsLike { get; set; } = true; // true = Like, false = Dislike

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}