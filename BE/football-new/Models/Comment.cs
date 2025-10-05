// Models/Comment.cs
using System;
using System.Collections.Generic;
using footballnew.Data;

namespace footballnew.Models
{
    public class Comment
    {
        public int Id { get; set; }

        public int ArticleId { get; set; }         // FK -> Article
        public int? ParentId { get; set; }         // Self reference (null => root comment)
        public string UserId { get; set; } = null!; // FK -> ApplicationUser (Identity)

        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsEdited { get; set; } = false;

        public bool IsHidden { get; set; } = false;

        public int LikeCount { get; set; } = 0;

        // Navigation
        public ApplicationUser? User { get; set; }
        public Comment? Parent { get; set; }

        public Article? Article { get; set; }
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();
        public ICollection<CommentLike> Likes { get; set; } = new List<CommentLike>();
    }
}
