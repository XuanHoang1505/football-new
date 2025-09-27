using footballnew.Enums;

namespace footballnew.DTOs
{
    public class ContentDTO
    {
        public int Id { get; set; }
        public int OrderIndex { get; set; }
        public ContentType Type { get; set; }
        public string? Text { get; set; }

        // Nếu type = Image => có ImageDTO
        public ImageDTO? Image { get; set; }
    }
}
