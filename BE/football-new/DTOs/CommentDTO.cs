namespace footballnew.DTOs
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public bool IsEdited { get; set; } = false;
        public int LikeCount { get; set; }
        public bool IsLikedByCurrentUser { get; set; } = false;
        // Thông tin user cơ bản
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string? UserAvatar { get; set; }

        // Quan hệ reply
        public int? ParentId { get; set; }
        public List<CommentDTO> Replies { get; set; } = new();
    }
}
