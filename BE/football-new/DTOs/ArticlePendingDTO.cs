using footballnew.Enums;

namespace footballnew.DTOs
{
    public class ArticlePendingDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Summary { get; set; }   // mô tả ngắn
        public string AuthorName { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? ImageUrl { get; set; }  // ảnh chính

        public string? CategoryName { get; set; }  // danh mục chính
        public DateTime SubmitDate { get; set; } // ngày gửi/publish
        public ArticleStatus Status { get; set; }   // để hiển thị badge màu
    }
}
