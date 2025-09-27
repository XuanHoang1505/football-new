using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using footballnew.Data;
using footballnew.Enums;

namespace footballnew.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string AuthorId { get; set; } = null!;
        public ApplicationUser Author { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? CanonicalUrl { get; set; }
        public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
        public string? UpdatedBy { get; set; }
        public ApplicationUser? UpdatedByUser { get; set; }

        public string? ApprovedBy { get; set; }
        public ApplicationUser? ApprovedByUser { get; set; }

        public string? RejectedBy { get; set; }
        public ApplicationUser? RejectedByUser { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? RejectedDate { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public DateTime? SubmitDate { get; set; }     
        public DateTime? ApprovedDate { get; set; }   
        public DateTime? DatePublished { get; set; }  
        public int ViewCount { get; set; } = 0;
        public int ShareCount { get; set; } = 0;
        public int CommentCount { get; set; } = 0;
        [ConcurrencyCheck]
        [Column(TypeName = "BINARY(8)")]
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();

        // Navigation
        public ICollection<Image> Images { get; set; } = new List<Image>();
        public ICollection<ArticleCategory> ArticleCategories { get; set; } = new List<ArticleCategory>();
        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
        public ICollection<ArticleViewHistory> ViewHistories { get; set; } = new List<ArticleViewHistory>();
        public ICollection<Content> Contents { get; set; } = new List<Content>();
    }
}
