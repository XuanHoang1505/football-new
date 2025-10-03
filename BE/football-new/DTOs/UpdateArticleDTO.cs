using System.Text.Json.Serialization;

namespace footballnew.DTOs
{
    public class UpdateArticleDTO
    {
        public int Id { get; set; }
        // Nội dung chính
        public string Title { get; set; } = null!;
        public string Summary { get; set; } = null!;
        
        // Hình ảnh
        public List<ImageDTO> Images { get; set; } = new();
        // Nội dung
        public List<ContentDTO> Contents { get; set; } = new();
    }
}