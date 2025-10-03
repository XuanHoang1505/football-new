using footballnew.Enums;

namespace footballnew.DTOs
{
    public class ArticleListDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public DateTime DatePublished { get; set; }
        public DateTime SubmitDate { get; set; }
        public string AuthorName { get; set; } = null!;
        public string? RejectionReason { get; set; }
        public DateTime? RejectedDate { get; set; }
        public string? RejectedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string? ApprovedBy { get; set; }

        public ArticleStatus Status { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? ViewAt { get; set; }
        public string? CategoryName { get; set; }
        public string? timeAgo { get; set; }
    }
}