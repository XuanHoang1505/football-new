using System.Text.Json.Serialization;

namespace footballnew.DTOs
{
    public class ArticleDetailDTO
    {
        public int Id { get; set; }

        // Author
        [JsonPropertyName("authorId")]
        public string AuthorId { get; set; } = null!;
        public string AuthorName { get; set; } = null!;
        public string? AuthorAvatar { get; set; }

        // Nội dung chính
        public string Title { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Slug { get; set; } = null!;

        // SEO
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? CanonicalUrl { get; set; }

        // Trạng thái
        public string Status { get; set; } = null!;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? SubmitDate { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? DatePublished { get; set; }

        // Thống kê
        public int ViewCount { get; set; }
        public int ShareCount { get; set; }
        public int CommentCount { get; set; }

        // Danh mục, tags
          [JsonPropertyName("mainCategoryId")]
        public string? MainCategoryId { get; set; }

        [JsonPropertyName("subCategoryIds")]
        public List<string>? SubCategoryIds { get; set; }
        public List<CategoryDTO> Categories { get; set; } = new();
        public List<string> Tags { get; set; } = new();

        // Hình ảnh
        public List<ImageDTO> Images { get; set; } = new();

        // Nội dung
        public List<ContentDTO> Contents { get; set; } = new();
    }
}