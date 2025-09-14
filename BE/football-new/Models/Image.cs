using System;

namespace footballnew.Models
{
    public class Image
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string Url { get; set; } = null!;
        public string? AltText { get; set; }
        public string? Caption { get; set; }
        public bool IsMain { get; set; } = false;
        public DateTime UploadDate { get; set; }
        public string? Credits { get; set; }

        // Navigation
        public Article Article { get; set; } = null!;
    }
}
