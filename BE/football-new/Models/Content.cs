using footballnew.Enums;
namespace footballnew.Models
{
    public class Content
    {
        public int Id { set; get; }
        public int ArticleId { get; set; }
        public Article Article { get; set; } = null!;
        public ContentType Type { get; set; } = ContentType.Paragraph;
        public string? Text { get; set; }
        public int OrderIndex { get; set; }
        public Image? Image { get; set; }
    }
}