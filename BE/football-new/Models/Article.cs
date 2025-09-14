using System;
using System.Collections.Generic;
using footballnew.Data;

namespace footballnew.Models
{
    public class Article
    {
        public int Id { get; set; }

        // 🔗 Tác giả
        public string AuthorId { get; set; } = null!;
        public ApplicationUser Author { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Slug { get; set; } = null!;

        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? CanonicalUrl { get; set; }

        public string Status { get; set; } = "Draft"; 

        // 🔗 Người cập nhật cuối
        public string? UpdatedBy { get; set; }
        public ApplicationUser? UpdatedByUser { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public DateTime DatePublished { get; set; }

        public int ViewCount { get; set; } = 0;
        public int ShareCount { get; set; } = 0;
        public int CommentCount { get; set; } = 0;

        // Navigation
        public ICollection<Image> Images { get; set; } = new List<Image>();
        public ICollection<ArticleCategory> ArticleCategories { get; set; } = new List<ArticleCategory>();
        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
        public ICollection<ArticleViewHistory> ViewHistories { get; set; } = new List<ArticleViewHistory>();
    }
}
